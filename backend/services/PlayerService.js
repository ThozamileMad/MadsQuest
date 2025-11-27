import { ok, notFound, serverError } from "../utils/response.js";

class PlayerService {
  constructor(db, userId) {
    this.db = db;
    this.userId = Number(userId);
  }

  /**
   * Retrieves player statistics by user ID
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  getPlayerStats = async () => {
    try {
      const query = await this.db.query(
        "SELECT * FROM player_stats WHERE id = $1",
        [this.userId]
      );

      if (query.rows.length === 0) {
        // Return empty array if no stats found
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error("Database error in getPlayerStats:", err);
      return serverError();
    }
  };

  /**
   * Applies a set of stat modifications to the player's current stats.
   *
   * @param {Object} choiceEffectsObj - Stat change values for a choice
   * @param {Object} playerStatsObj - Player's current stats
   * @returns {number[]} Updated stats as an array
   */
  applyStatChanges = (choiceEffectsObj, playerStatsObj) => {
    const choiceEffects = Object.values(choiceEffectsObj);

    return Object.values(playerStatsObj).map(
      (statVal, index) => Number(statVal) + Number(choiceEffects[index])
    );
  };

  /**
   * Updates the player's stats for the current user
   * @param {Array} newPlayerStats - [life, mana, morale, coin]
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  updatePlayerStats = async (newPlayerStats) => {
    try {
      await this.db.query(
        `
        UPDATE player_stats 
        SET life = $1, mana = $2, morale = $3, coin = $4
        WHERE id = $5
      `,
        [...newPlayerStats, this.userId]
      );

      return ok("Stats updated.");
    } catch (err) {
      console.error("Database error in updatePlayerStats:", err);
      return serverError();
    }
  };
}

export default PlayerService;
