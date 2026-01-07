import AchievementService from "../services/AchievementService.js";
import LuckService from "../services/LuckService.js";
import { getLuckProcess, updateLuckProcess } from "./LuckController.js";
import { serverError } from "../utils/response.js";

// ----------------------
// Get Achivements Process
// ----------------------

const getAchievementsProcess = async (db, userId) => {
  const achievementService = new AchievementService(db, userId);

  // Every unlocked and locked achievements
  let allAchievementsData = await achievementService.getAllAchievements();
  if (!allAchievementsData.success) return allAchievementsData;

  // All the players unlocked achievememts
  let playerAchievementsData = await achievementService.getPlayerAchievements();
  if (!playerAchievementsData.success) return playerAchievementsData;

  // Every unlocked and locked achievements with labels indicating if locked/unlocked
  const unlockedAchievementsIds = playerAchievementsData.result.map(
    (achievement) => achievement.id
  );

  let unlockedAndLockedAchievements = allAchievementsData.result.map(
    (achievement) => {
      if (unlockedAchievementsIds.includes(achievement.id)) {
        return { ...achievement, unlocked: true };
      }

      return { ...achievement, unlocked: false };
    }
  );

  allAchievementsData.result = unlockedAndLockedAchievements;
  return allAchievementsData;
};

// ----------------------
// Unlock Achievement Process
// ----------------------

const unlockAchievementProcess = async (db, userId, sceneId) => {
  const achievementService = new AchievementService(db, userId);
  const luckService = new LuckService(db, userId);

  // Get the all achievements
  const achievementData = await achievementService.getAchievement(sceneId);
  if (!achievementData.success) return achievementData;
  const achievementId = achievementData.result[0].id;
  const achievementLuck = achievementData.result[0].luck;

  // Get all the players unlocked achievements
  // If a player has already unlocked an achievement abort process
  const playerAchievementsData =
    await achievementService.getPlayerAchievements();
  const achievementUnlocked = playerAchievementsData.result.find(
    (achievement) => achievement.id === achievementId
  );
  if (achievementUnlocked) return serverError();

  // Add achievement to database
  const achievementCreated = await achievementService.createAchievement(
    achievementId
  );
  if (!achievementCreated.success) return achievementCreated;

  // Increase luck based on achievement
  let currentLuckData = await getLuckProcess(db, userId);
  if (!currentLuckData.success) return currentLuckData;

  const currentLuck = currentLuckData.result[0].luck;
  const updatedLuck = currentLuck + achievementLuck;
  const luckUpdated = await updateLuckProcess(db, userId, updatedLuck);
  if (!luckUpdated.success) return luckUpdated;

  return achievementData;
};

export { getAchievementsProcess, unlockAchievementProcess };
