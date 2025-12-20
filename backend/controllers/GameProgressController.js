import PlayerService from "../services/PlayerService.js";
import SceneService from "../services/SceneService.js";
import GameProgressService from "../services/GameProgressService.js";

const TABLES = {
  CHECKPOINT: "checkpoints",
  LAST_CHOICE: "last_choice",
};

// ----------------------------------
// CREATE CHECKPOINT
// ----------------------------------
const createCheckpointProcess = async (db, sceneId, userId) => {
  const sceneService = new SceneService(db, sceneId);
  const playerService = new PlayerService(db, userId);
  const progressService = new GameProgressService(db, {
    table: TABLES.CHECKPOINT,
    sceneId,
    userId,
  });

  const sceneData = await sceneService.getScene();
  if (!sceneData.success || !sceneData.result[0].is_checkpoint) {
    return sceneData;
  }

  const playerStats = await playerService.getPlayerStats();
  if (!playerStats.success) return playerStats;

  const { life, mana, morale, coin } = playerStats.result[0];
  const stats = [life, mana, morale, coin];

  const existing = await progressService.getRecord();

  if (!existing.success && existing.statusCode === 404) {
    return progressService.createRecord(stats);
  }

  return progressService.updateRecord(stats);
};

// ----------------------------------
// RETURN TO CHECKPOINT OR LAST CHOICE
// ----------------------------------
const returnToPreviousProcess = async (db, userId, table) => {
  const playerService = new PlayerService(db, userId);
  const progressService = new GameProgressService(db, {
    table: table,
    sceneId: 0,
    userId,
  });

  const record = await progressService.getRecord();
  if (!record.success) return record;

  // Update stats
  const { life, mana, morale, coin } = record.result[0];
  const newStats = [life, mana, morale, coin];
  const statsUpdated = await playerService.updatePlayerStats(newStats);

  if (!statsUpdated.success) {
    return statsUpdated;
  }

  return record;
};

// ----------------------------------
// CREATE LAST CHOICE
// ----------------------------------
const createLastChoiceProcess = async (db, sceneId, userId) => {
  const playerService = new PlayerService(db, userId);
  const progressService = new GameProgressService(db, {
    table: TABLES.LAST_CHOICE,
    sceneId,
    userId,
  });

  const playerStats = await playerService.getPlayerStats();
  if (!playerStats.success) return playerStats;

  const { life, mana, morale, coin } = playerStats.result[0];
  const stats = [life, mana, morale, coin];

  const existing = await progressService.getRecord();

  if (!existing.success && existing.statusCode === 404) {
    return progressService.createRecord(stats);
  }

  return progressService.updateRecord(stats);
};

// ----------------------------------
// RESTART GAME
// ----------------------------------
const restartGameProcess = async (db, userId) => {
  const playerService = new PlayerService(db, userId);
  const defaultStats = [12, 8, 0, 0];
  return playerService.updatePlayerStats(defaultStats);
};

export {
  createCheckpointProcess,
  returnToPreviousProcess,
  createLastChoiceProcess,
  restartGameProcess,
};
