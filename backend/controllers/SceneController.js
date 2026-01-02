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
  status
) => {
  const newSceneData = sceneData.result[0].content;

  const newChoiceData = choiceData.result.map(
    ({ scene_id, icon, choice_text, next_scene_id }) => ({
      sceneId: scene_id,
      icon,
      text: choice_text,
      nextSceneId: next_scene_id,
    })
  );

  let newChoiceEffectsData = choiceEffectsData.result[0];
  const { life_change, mana_change, morale_change, coin_change } =
    newChoiceEffectsData;
  newChoiceEffectsData = [life_change, mana_change, morale_change, coin_change];

  let newPlayerStats = playerStatsData.result[0];
  const { life, mana, morale, coin } = newPlayerStats;
  newPlayerStats = [life, mana, morale, coin];

  return {
    sceneData: newSceneData,
    choiceData: newChoiceData,
    choiceEffectsData: newChoiceEffectsData,
    playerStatsData: newPlayerStats,
    status,
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
 * @param {boolean|string} updateStats - Dictates if stats are updated or not
 * @returns {Promise<Object>} { success, result, statusCode }
 */
const createSceneProcess = async (db, userId, sceneId, updateStats) => {
  const sceneService = new SceneService(db, sceneId);
  const playerService = new PlayerService(db, userId);

  // Reset stats when player enters the first scene
  if (sceneId === 1) {
    await playerService.updatePlayerStats([12, 8, 0, 0]);
  }

  // Fetch scene-related data
  const sceneData = await sceneService.getScene();
  if (!sceneData.success) return sceneData;

  let choiceData = await sceneService.getChoices();
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
  if (updateStats) {
    await playerService.updatePlayerStats(updatedPlayerStats);
    playerStatsData = await playerService.getPlayerStats();
    if (!playerStatsData.success) return playerStatsData;
  }

  // Do not set choice effects if updateStats is false
  if (!updateStats) {
    choiceEffectsData.result = [0, 0, 0, 0];
  }

  const updatedLife = updatedPlayerStats[0];

  // Check if scene is checkpoint
  let isCheckpoint = await sceneService.sceneIsCheckpoint(
    choiceData.result[0].next_scene_id
  );
  isCheckpoint = isCheckpoint.result;

  // Handle game-over condition
  const isGameOver = updatedLife <= 0;

  // Set player status
  let status = "active";

  if (isGameOver) {
    status = "dead";
  } else if (isCheckpoint) {
    status = "checkpoint";
  }

  return {
    success: true,
    result: getNecessaryInfo(
      sceneData,
      choiceData,
      choiceEffectsData,
      playerStatsData,
      status
    ),
    statusCode: 200,
  };
};

/**
 * Resets the player's stats to their initial values,
 * effectively restarting the game.
 *
 * @param {Object} db - Database client instance
 * @param {number|string} userId - Player identifier
 * @returns {Promise<Object>} Database operation result indicating success or failure
 
const restartGameProcess = async (db, userId) => {
  const playerService = new PlayerService(db, userId);

  // Apply the new base stats to the player (reset state)
  const defaultStats = [12, 8, 0, 0];
  const statsUpdated = await playerService.updatePlayerStats(defaultStats);

  return statsUpdated;
};*/

export { createSceneProcess };
