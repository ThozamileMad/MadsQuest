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

const getStoryData = async (sql, sqlParam, errorMsg) => {
  try {
    let query = await db.query(sql, [sqlParam]);
    if (query.rows.length === 0) {
      return { success: false, result: errorMsg, status_code: 404 };
    }

    return { success: true, result: query.rows };
  } catch (err) {
    console.error(err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

app.get("/get_scene/:scene_id/:user_id", async (req, res) => {
  const sceneID = req.params.scene_id;
  const userID = req.params.user_id;

  const sceneData = await getStoryData(
    "SELECT content, image_url  FROM scenes WHERE id = $1",
    parseInt(sceneID),
    "Scene not found."
  );
  if (!sceneData.success) {
    return res.status(sceneData.status_code).json(sceneData.result);
  }

  const choicesData = await getStoryData(
    "SELECT id, icon, choice_text, next_scene_id  FROM choices WHERE scene_id = $1",
    parseInt(sceneID),
    "Choices not found."
  );
  if (!choicesData.success) {
    return res.status(choicesData.status_code).json(choicesData.result);
  }

  const choiceEffectsData = await getStoryData(
    "SELECT life_change, mana_change, morale_change, coin_change FROM choice_effects WHERE scene_id = $1",
    parseInt(sceneID),
    "Choice effects not found."
  );
  if (!choiceEffectsData.success) {
    return res
      .status(choiceEffectsData.status_code)
      .json(choiceEffectsData.result);
  }

  console.log(choiceEffectsData);

  const playerStatsData = await getStoryData(
    "SELECT life, mana, morale, coin FROM player_stats WHERE id = $1",
    parseInt(userID),
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

  if (newPlayerStats[0] <= 0) {
    return res.json({ game_over: true });
  }
  await db.query(
    "UPDATE player_stats SET life = $1, mana = $2, morale = $3, coin = $4",
    newPlayerStats
  );

  res.json({
    scene: sceneData.result,
    choices: choicesData.result,
    choiceEffects: choiceEffectsData.result,
    playerStats: playerStatsData.result,
    game_over: false,
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
