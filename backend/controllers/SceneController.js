import SceneService from "../services/SceneService.js";
import PlayerService from "../services/PlayerService.js";

/**
 * Orchestrates scene and player operations to prepare
 * all data required to present a scene to the player.
 *
 * @param {Object} db - Database client/connection instance
 * @param {number|string} userId - Player identifier
 * @param {number|string} sceneId - Scene identifier
 * @returns {Promise<Object>} Promise resolving to { success, result, statusCode }
 */
const createSceneProcess = async (db, userId, sceneId) => {
  const sceneService = new SceneService(db, sceneId);
  const playerService = new PlayerService(db, userId);

  // Reset player stats if entering the first scene
  if (sceneId === 1) {
    await playerService.updatePlayerStats([12, 8, 0, 0]);
  }

  // Fetch scene
  const sceneData = await sceneService.getScene();
  if (!sceneData.success) return sceneData;

  // Fetch choices
  const choiceData = await sceneService.getChoices();
  if (!choiceData.success) return choiceData;

  // Fetch choice effects
  const choiceEffectsData = await sceneService.getChoiceEffects();
  if (!choiceEffectsData.success) return choiceEffectsData;

  // Fetch player stats
  const playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  // Apply stat changes based on chosen effects
  const newPlayerStats = playerService.applyStatChanges(
    choiceEffectsData.result[0],
    playerStatsData.result[0]
  );
  await playerService.updatePlayerStats(newPlayerStats);

  const lifeStat = newPlayerStats[0];

  // Game over condition
  if (lifeStat <= 0) {
    return {
      success: true,
      result: {
        scene: sceneData.result,
        choiceEffects: choiceEffectsData.result,
        playerStats: newPlayerStats,
        gameOver: true,
      },
      statusCode: 200,
    };
  }

  return {
    success: true,
    result: {
      scene: sceneData.result,
      choices: choiceData.result,
      choiceEffects: choiceEffectsData.result,
      playerStats: newPlayerStats,
      gameOver: false,
    },
    statusCode: 200,
  };
};

export default createSceneProcess;
