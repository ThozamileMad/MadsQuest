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

/**
 * Fetches scene data by ID from the database
 * @param {string|number} sceneId - The ID of the scene to retrieve
 * @returns {Promise<Object>} Result object with success status, data, and status code
 */
const getSceneData = async (sceneId) => {
  try {
    const query = await db.query("SELECT * FROM scenes WHERE id = $1", [
      parseInt(sceneId),
    ]);

    if (query.rows.length === 0) {
      return { success: false, result: "Scene not found.", status_code: 404 };
    }

    return { success: true, result: query.rows[0], status_code: 200 };
  } catch (err) {
    console.error("Database error in getSceneData:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Retrieves all choices available for a specific scene
 * @param {string|number} sceneId - The scene ID to get choices for
 * @returns {Promise<Object>} Array of choice objects or error response
 */
const getChoicesData = async (sceneId) => {
  try {
    const query = await db.query("SELECT * FROM choices WHERE scene_id = $1", [
      parseInt(sceneId),
    ]);

    if (query.rows.length === 0) {
      return { success: false, result: "Choices not found.", status_code: 404 };
    }

    return { success: true, result: query.rows, status_code: 200 };
  } catch (err) {
    console.error("Database error in getChoicesData:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Fetches effects associated with choices in a scene
 * @param {string|number} sceneId - The scene ID to get choice effects for
 * @returns {Promise<Object>} Array of effect objects or error response
 */
const getChoiceEffectsData = async (sceneId) => {
  try {
    const query = await db.query(
      "SELECT * FROM choice_effects WHERE scene_id = $1",
      [parseInt(sceneId)]
    );

    if (query.rows.length === 0) {
      return {
        success: false,
        result: "Choice effects not found.",
        status_code: 404,
      };
    }

    return { success: true, result: query.rows, status_code: 200 };
  } catch (err) {
    console.error("Database error in getChoiceEffectsData:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Retrieves player statistics by user ID
 * @param {string|number} userId - The user ID to get stats for
 * @returns {Promise<Object>} Player stats object or error response
 */
const getPlayerStatsData = async (userId) => {
  try {
    const query = await db.query("SELECT * FROM player_stats WHERE id = $1", [
      parseInt(userId),
    ]);

    if (query.rows.length === 0) {
      return {
        success: false,
        result: "Player stats not found.",
        status_code: 404,
      };
    }

    return { success: true, result: query.rows[0], status_code: 200 };
  } catch (err) {
    console.error("Database error in getPlayerStatsData:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Checks if a checkpoint exists for a specific scene and user
 * Used to determine if the user has already reached this checkpoint
 * @param {string|number} sceneId - The scene ID to check for checkpoint
 * @param {string|number} userId - The user ID to check checkpoint for
 * @returns {Promise<Object>} Checkpoint data or error response
 */
const getCheckpointData = async (sceneId, userId) => {
  try {
    const query = await db.query(
      "SELECT * FROM checkpoints WHERE scene_id = $1 AND user_id = $2",
      [parseInt(sceneId), parseInt(userId)]
    );

    if (query.rows.length === 0) {
      return {
        success: false,
        result: "Checkpoint not found",
        status_code: 404,
      };
    }

    return { success: true, result: query.rows[0], status_code: 200 };
  } catch (err) {
    console.error("Database error in getCheckpointData:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Applies a set of stat modifications to the player's current stats.
 *
 * @param {Object} choiceEffectsObj - An object whose values represent the
 *   stat changes caused by a specific choice (e.g. { health: -5, xp: +10 }).
 *
 * @param {Object} playerStatsObj - An object containing the player's current
 *   stats in the same order/structure as choiceEffectsObj.
 *
 * @returns {number[]} A new array of updated player stats after applying
 *   the corresponding effects.
 *
 * NOTE:
 * - Assumes both objects have the same number of values and aligned order.
 * - If order is not guaranteed, this function should be updated to match keys.
 */
const applyStatChanges = (choiceEffectsObj, playerStatsObj) => {
  // Extract stat-change values (e.g. [-5, 10])
  const choiceEffects = Object.values(choiceEffectsObj);

  // Apply each effect to the corresponding player stat
  const newPlayerStats = Object.values(playerStatsObj).map(
    (statVal, index) => statVal + choiceEffects[index]
  );

  return newPlayerStats;
};

/**
 * Creates a new checkpoint record to save player progress
 * @param {string|number} sceneId - The scene ID where checkpoint is created
 * @param {string|number} userId - The user ID to associate with checkpoint
 * @param {Array} newPlayerStats - Updated player stats [life, mana, morale, coin]
 * @returns {Object} Express response indicating success or failure
 */
const createCheckpoint = async (sceneId, userId, newPlayerStats) => {
  try {
    await db.query(
      `INSERT INTO checkpoints (scene_id, user_id, life, mana, morale, coin)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [parseInt(sceneId), parseInt(userId), ...newPlayerStats]
    );

    return { success: true, result: "checkpoint inserted", status_code: 200 };
  } catch (err) {
    console.error("Database insert error in checkpoint creation:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

/**
 * Updates an existing checkpoint with new scene and player stats
 * @param {string|number} sceneId - The new scene ID to update
 * @param {string|number} userId - The user ID to identify the checkpoint
 * @param {Array} newPlayerStats - Updated player stats [life, mana, morale, coin]
 * @returns {Object} Express response indicating success or failure
 */
const updateCheckpoint = async (sceneId, userId, newPlayerStats) => {
  try {
    await db.query(
      `UPDATE checkpoints 
       SET scene_id = $1, life = $2, mana = $3, morale = $4, coin = $5
       WHERE user_id = $6`,
      [parseInt(sceneId), ...newPlayerStats, parseInt(userId)]
    );

    return { success: true, result: "checkpoint updated", status_code: 200 };
  } catch (err) {
    console.error("Database update error in updateCheckpoint:", err);
    return { success: false, result: "Database Error", status_code: 500 };
  }
};

const handleCheckpointGetQueries = async () => {
  const sceneData = await getSceneData(sceneId);
  const choiceEffectsData = await getChoiceEffectsData(sceneId);
  const playerStatsData = await getPlayerStatsData(sceneId);
  const checkpointData = await getCheckpointData(sceneId, userId);

  const allData = [
    sceneData,
    choiceEffectsData,
    playerStatsData,
    checkpointData,
  ];
  for (const obj of allData) {
    if (!obj.success) {
      return obj;
    }
  }

  return checkpointData;
};

app.get("/api/checkpoint/:scene_id/:user_id", async (req, res) => {
  const sceneId = req.params.scene_id;
  const userId = req.params.user_id;

  const { success, result, status_code } = handleCheckpointGetQueries();
  if (!success && !result.toLowerCase().includes("checkpoint")) {
    return res.status(status_code).json(result);
  }

  /*
  const sceneData = await getSceneData(sceneId);
  if (!sceneData.success) {
    return res.status(sceneData.status_code).json(sceneData.result);
  }

  const choiceEffectsData = await getChoiceEffectsData(sceneId);
  if (!choiceEffectsData.success) {
    return res
      .status(choiceEffectsData.status_code)
      .json(choiceEffectsData.result);
  }

  const playerStatsData = await getPlayerStatsData(sceneId);
  if (!playerStatsData.success) {
    return res.status(playerStatsData.status_code).json(playerStatsData.result);
  }

  // Retreive checkpoint data,
  const checkpointData = getCheckpointData(sceneId, userId);
  */

  // If checkpoint does not exist in database, add a checkpoint
  if (
    !checkpointData.success &&
    checkpointData.result === "Checkpoint not found"
  ) {
    const checkpointCreation = createCheckpoint(sceneId, userId);
    return res
      .status(checkpointCreation.status_code)
      .json(checkpointCreation.result);
  }

  // If checkpoint does exist in database, update stats.
  const newPlayerStats = applyStatChanges(
    choiceEffectsData.result[0],
    playerStatsData.result[0]
  );
  const checkpointUpdate = updateCheckpoint(sceneId, userId, newPlayerStats);
  return res.status(checkpointUpdate.status_code).json(checkpointUpdate.result);
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
