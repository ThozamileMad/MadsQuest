import SceneService from "../services/SceneService.js";
import PlayerService from "../services/PlayerService.js";
import CheckpointService from "../services/CheckpointService.js";

// ----------------------
// Checkpoint Processing Logic
// ----------------------

/**
 * Orchestrates scene, player, and checkpoint services to make a checkpoint for the player
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
  if (!sceneData.success) return sceneData;

  // Fetch choice effects
  const choiceEffectsData = await sceneService.getChoiceEffects();
  if (!choiceEffectsData.success) return choiceEffectsData;

  // Fetch player stats
  const playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  // Retrieve checkpoint
  const checkpointData = await checkpointService.getCheckpoint();

  // Update existing checkpoint
  const newPlayerStats = playerService.applyStatChanges(
    choiceEffectsData.result[0],
    playerStatsData.result[0]
  );

  // Create new checkpoint if none exists
  if (!checkpointData.success && checkpointData.statusCode === 404) {
    const checkpointCreation = await checkpointService.createCheckpoint(
      newPlayerStats
    );
    return checkpointCreation;
  }

  const checkpointUpdate = await checkpointService.updateCheckpoint(
    newPlayerStats
  );
  return checkpointUpdate;
};

export default createCheckpointProcess;
