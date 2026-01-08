import LuckService from "../services/LuckService.js";
import PlayerService from "../services/PlayerService.js";
import { ok } from "../utils/response.js";

// ----------------------
// Luck Retrieval Process
// ----------------------

const getLuckProcess = async (db, userId) => {
  const luckService = new LuckService(db, userId);

  let luckData = await luckService.getLuck();
  if (!luckData.success) return luckData;

  return luckData;
};

// ----------------------
// Luck Modification Process
// ----------------------

const updateLuckProcess = async (db, userId, luck) => {
  const luckService = new LuckService(db, userId);

  const luckUpdated = await luckService.updateLuck(luck);
  if (!luckUpdated.success) return luckUpdated;

  return luckUpdated;
};

const boostStatsProcess = async (db, userId, boostAmount, stat) => {
  const playerService = new PlayerService(db, userId);

  // Update player luck (decrease luck)
  let currentLuckData = await getLuckProcess(db, userId);
  if (!currentLuckData.success) return currentLuckData;

  const currentLuck = currentLuckData.result[0].luck;
  const updatedLuck = currentLuck + -boostAmount;
  const luckUpdated = await updateLuckProcess(db, userId, updatedLuck);
  if (!luckUpdated.success) return luckUpdated;

  // Update player stats (increase stat)
  let playerStatsData = await playerService.getPlayerStats();
  if (!playerStatsData.success) return playerStatsData;

  let newPlayerStats = playerStatsData.result[0];

  if (stat === "life") {
    newPlayerStats.life = newPlayerStats.life + boostAmount;
  }

  if (stat === "mana") {
    newPlayerStats.mana = newPlayerStats.mana + boostAmount;
  }

  const statsUpdated = await playerService.updatePlayerStats([
    newPlayerStats.life,
    newPlayerStats.mana,
    newPlayerStats.morale,
    newPlayerStats.coin,
  ]);
  if (!statsUpdated.success) return statsUpdated;

  // Return updated luck and stats
  return ok([
    {
      luck: updatedLuck,
      life: newPlayerStats.life,
      mana: newPlayerStats.mana,
    },
  ]);
};

export { getLuckProcess, updateLuckProcess, boostStatsProcess };
