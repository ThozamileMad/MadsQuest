import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const db = new pg.Client({
  user: "postgres",
  password: "MadPostgres@2",
  host: "localhost",
  port: "5432",
  database: "madsquest",
});

db.connect();

let sceneID = 1;

const executeQuery = async (sql, sqlParams, errorMsg) => {
  try {
    let query = await db.query(sql, sqlParams);
    if (query.rows.length === 0) {
      return { success: false, result: errorMsg, status_code: 404 };
    }

    return { success: true, result: query.rows };
  } catch (err) {
    console.error(err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

app.get("/api/checkpoint/:scene_id/:user_id", async (req, res) => {
  const sceneID = req.params.scene_id;
  const userID = req.params.user_id;

  const sceneData = await executeQuery(
    "SELECT is_checkpoint FROM scenes WHERE id = $1 AND is_checkpoint = true",
    [parseInt(sceneID)],
    "Scene not found."
  );
  if (!sceneData.success) {
    return res.status(sceneData.status_code).json(sceneData.result);
  }

  const checkpointData = await executeQuery(
    "SELECT * FROM checkpoints WHERE scene_id = $1 AND user_id = $2",
    [parseInt(sceneID), parseInt(userID)],
    "Checkpoint not found"
  );

  const noRecord =
    !checkpointData.success && checkpointData.result === "Checkpoint not found";

  const choiceEffectsData = await executeQuery(
    "SELECT life_change, mana_change, morale_change, coin_change FROM choice_effects WHERE scene_id = $1",
    [parseInt(sceneID)],
    "Choice effects not found."
  );
  if (!choiceEffectsData.success) {
    return res
      .status(choiceEffectsData.status_code)
      .json(choiceEffectsData.result);
  }

  const playerStatsData = await executeQuery(
    "SELECT life, mana, morale, coin FROM player_stats WHERE id = $1",
    [parseInt(userID)],
    "Player stats not found."
  );
  if (!playerStatsData.success) {
    return res.status(playerStatsData.status_code).json(playerStatsData.result);
  }

  const choiceEffects = Object.values(choiceEffectsData.result[0]);
  const newPlayerStats = Object.values(playerStatsData.result[0]).map(
    (item, index) => item + choiceEffects[index]
  );

  if (noRecord) {
    try {
      await db.query(
        `
        INSERT INTO checkpoints (scene_id, user_id, life, mana, morale, coin)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [parseInt(sceneID), parseInt(userID), ...newPlayerStats]
      );
      console.log({ success: true, result: "checkpoint inserted" });
      return res.json({ success: true, result: "checkpoint inserted" });
    } catch (err) {
      console.error("Database insert error:", err);
      return { success: false, result: "Database Error", status_code: 500 };
    }
  }

  try {
    await db.query(
      `
      UPDATE checkpoints 
      SET scene_id = $1, life = $2, mana = $3, morale = $4, coin = $5
      WHERE user_id = $6
      `,
      [parseInt(sceneID), ...newPlayerStats, parseInt(userID)]
    );
    console.log({ success: true, result: "checkpoint updated" });
    return res.json({ success: true, result: "checkpoint updated" });
  } catch (err) {
    console.error("Database update error:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
});

app.get("/get_scene/:scene_id/:user_id", async (req, res) => {
  const sceneID = req.params.scene_id;
  const userID = req.params.user_id;

  if (sceneID == 1) {
    await db.query(
      `
       UPDATE player_stats 
       SET life = 12, mana = 8, morale = 0, coin = 0
       WHERE id = $1
      `,
      [parseInt(userID)]
    );
  }

  const sceneData = await executeQuery(
    "SELECT id, content, image_url, is_checkpoint  FROM scenes WHERE id = $1",
    [parseInt(sceneID)],
    "Scene not found."
  );
  if (!sceneData.success) {
    return res.status(sceneData.status_code).json(sceneData.result);
  }

  const choicesData = await executeQuery(
    "SELECT id, icon, choice_text, next_scene_id  FROM choices WHERE scene_id = $1",
    [parseInt(sceneID)],
    "Choices not found."
  );
  if (!choicesData.success) {
    return res.status(choicesData.status_code).json(choicesData.result);
  }

  const choiceEffectsData = await executeQuery(
    "SELECT life_change, mana_change, morale_change, coin_change FROM choice_effects WHERE scene_id = $1",
    [parseInt(sceneID)],
    "Choice effects not found."
  );
  if (!choiceEffectsData.success) {
    return res
      .status(choiceEffectsData.status_code)
      .json(choiceEffectsData.result);
  }

  const playerStatsData = await executeQuery(
    "SELECT life, mana, morale, coin FROM player_stats WHERE id = $1",
    [parseInt(userID)],
    "Player stats not found."
  );
  if (!playerStatsData.success) {
    return res.status(playerStatsData.status_code).json(playerStatsData.result);
  }

  console.log({
    scene: sceneData.result,
    choices: choicesData.result,
    choiceEffects: choiceEffectsData.result,
    playerStats: playerStatsData.result,
  });

  const choiceEffects = Object.values(choiceEffectsData.result[0]);
  const newPlayerStats = Object.values(playerStatsData.result[0]).map(
    (item, index) => item + choiceEffects[index]
  );

  await db.query(
    "UPDATE player_stats SET life = $1, mana = $2, morale = $3, coin = $4",
    newPlayerStats
  );

  const lifeStat = newPlayerStats[0];
  if (lifeStat <= 0) {
    return res.json({
      scene: sceneData.result,
      choiceEffects: choiceEffects,
      playerStats: newPlayerStats,
      game_over: true,
    });
  }

  res.json({
    scene: sceneData.result,
    choices: choicesData.result,
    choiceEffects: choiceEffects,
    playerStats: newPlayerStats,
    game_over: false,
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
