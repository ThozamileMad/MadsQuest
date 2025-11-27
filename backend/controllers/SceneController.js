import SceneService from "../services/SceneService.js";
import PlayerService from "../services/PlayerService.js";

// ----------------------
// Scene Processing Helpers
// ----------------------

/**
 * Extracts only the data required by the frontend for a scene.
 */
const getNecessaryInfo = (
  sceneData,
  choiceData,
  choiceEffectsData,
  playerStatsData,
  isGameOver
) => {
  const newSceneData = sceneData.result[0].content;

  const newChoiceData = choiceData.result.map(
    ({ icon, choice_text, next_scene_id }) => ({
      icon,
      choice_text,
      next_scene_id,
    })
  );

  const newChoiceEffectsData = choiceEffectsData.result.map(
    ({ life_change, mana_change, morale_change, coin_change }) => {
      return [life_change, mana_change, morale_change, coin_change];
    }
  );

  const newPlayerStats = playerStatsData.result.map(
    ({ life, mana, morale, coin }) => {
      return [life, mana, morale, coin];
    }
  );

  return {
    sceneData: newSceneData,
    choiceData: newChoiceData,
    choiceEffectsData: newChoiceEffectsData,
    playerStatsData: newPlayerStats,
    isGameOver,
  };
};

// ----------------------
// Scene Processing Logic
// ----------------------

/**
 * Orchestrates scene and player operations to assemble all data
 * required to present a scene to the player.
 *
 * @param {Object} db - Database client instance
 * @param {number|string} userId - Player identifier
 * @param {number|string} sceneId - Scene identifier
 * @returns {Promise<Object>} { success, result, statusCode }
 */
const createSceneProcess = async (db, userId, sceneId) => {
  const sceneService = new SceneService(db, sceneId);
  const playerService = new PlayerService(db, userId);

  // Reset stats when player enters the first scene
  if (sceneId === 1) {
    await playerService.updatePlayerStats([12, 8, 0, 0]);
  }

  // Fetch scene-related data
  const sceneData = await sceneService.getScene();
  if (!sceneData.success) return sceneData;

  const choiceData = await sceneService.getChoices();
  if (!choiceData.success) return choiceData;

  const choiceEffectsData = await sceneService.getChoiceEffects();
  if (!choiceEffectsData.success) return choiceEffectsData;

  // Fetch player stats for current user
  let playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  // Compute updated stats based on effect modifiers
  const { life_change, mana_change, morale_change, coin_change } =
    choiceEffectsData.result[0];

  const { life, mana, morale, coin } = playerStatsData.result[0];

  const updatedPlayerStats = playerService.applyStatChanges(
    { life_change, mana_change, morale_change, coin_change },
    { life, mana, morale, coin }
  );

  // Persist stat changes and fetch the refreshed stats
  await playerService.updatePlayerStats(updatedPlayerStats);
  playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  const updatedLife = updatedPlayerStats[0];

  // Handle game-over condition
  const isGameOver = updatedLife <= 0;

  return {
    success: true,
    result: getNecessaryInfo(
      sceneData,
      choiceData,
      choiceEffectsData,
      playerStatsData,
      isGameOver
    ),
    statusCode: 200,
  };
};

export default createSceneProcess;
