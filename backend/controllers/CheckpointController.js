import SceneService from "../services/SceneService.js";
import PlayerService from "../services/PlayerService.js";
import CheckpointService from "../services/CheckpointService.js";

// ----------------------
// Checkpoint Processing Logic
// ----------------------

/**
 * Orchestrates scene, player, and checkpoint services to make a checkpoint for the player
 *
 * @param {Object} db - Database client/connection
 * @param {number|string} userId - Player identifier
 * @param {number|string} sceneId - Scene identifier
 * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
 */
const createCheckpointProcess = async (db, sceneId, userId) => {
  const sceneService = new SceneService(db, sceneId);
  const playerService = new PlayerService(db, userId);
  const checkpointService = new CheckpointService(db, sceneId, userId);

  // Fetch scene
  const sceneData = await sceneService.getScene();
  const isCheckpoint = sceneData.result[0].is_checkpoint;
  if (!sceneData.success || !isCheckpoint) return sceneData;

  // Fetch choice effects
  const choiceEffectsData = await sceneService.getChoiceEffects();
  if (!choiceEffectsData.success) return choiceEffectsData;

  // Fetch player stats
  const playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  // Retrieve checkpoint
  const checkpointData = await checkpointService.getCheckpoint();

  // Create new checkpoint if none exists
  const { life, mana, coin, morale } = playerStatsData.result[0];
  const statsArray = Object.values({ life, mana, coin, morale });

  if (!checkpointData.success && checkpointData.statusCode === 404) {
    const checkpointCreation = await checkpointService.createCheckpoint(
      statsArray
    );
    return checkpointCreation;
  }

  // Update existing checkpoint
  const checkpointUpdate = await checkpointService.updateCheckpoint(statsArray);
  console.log(checkpointUpdate);
  return checkpointUpdate;
};

// ----------------------
// Checkpoint Data
// ----------------------

/**
 * Retreieves checkpoint data (scene_id, user_id, life, mana, morale, coin)
 * and updates old player stats with new stats
 *
 * @param {Object} db - Database client/connection
 * @param {number|string} userId - Player identifier
 * @param {number|string} sceneId - Scene identifier
 * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
 */

const returnToCheckpointProcess = async (db, sceneId, userId) => {
  const checkpointService = new CheckpointService(db, sceneId, userId);
  const playerService = new PlayerService(db, userId);

  // Fetch checkpoint
  const checkpointData = await checkpointService.getCheckpoint();

  if (!checkpointData.success) {
    return checkpointData;
  }

  // Update stats
  const { life, mana, morale, coin } = checkpointData.result[0];
  const newStats = [life, mana, morale, coin];
  const statsUpdated = await playerService.updatePlayerStats(newStats);

  if (!statsUpdated.success) {
    return statsUpdated;
  }

  return checkpointData;
};

export { createCheckpointProcess, returnToCheckpointProcess };
