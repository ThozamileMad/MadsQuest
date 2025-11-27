import { ok, notFound, serverError } from "../utils/response.js";

class CheckpointService {
  constructor(db, sceneId, userId) {
    this.db = db;
    this.sceneId = Number(sceneId);
    this.userId = Number(userId);
  }

  /**
   * Checks if a checkpoint exists for a specific scene and user
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  getCheckpoint = async () => {
    try {
      const query = await this.db.query(
        "SELECT * FROM checkpoints WHERE scene_id = $1 AND user_id = $2",
        [this.sceneId, this.userId]
      );

      if (query.rows.length === 0) {
        // Return empty object if checkpoint does not exist
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error("Database error in getCheckpoint:", err);
      return serverError();
    }
  };

  /**
   * Creates a new checkpoint record
   * @param {Array} newPlayerStats - [life, mana, morale, coin]
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  createCheckpoint = async (newPlayerStats) => {
    try {
      await this.db.query(
        `INSERT INTO checkpoints (scene_id, user_id, life, mana, morale, coin)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [this.sceneId, this.userId, ...newPlayerStats]
      );

      return ok("Checkpoint inserted");
    } catch (err) {
      console.error("Database insert error in createCheckpoint:", err);
      return serverError();
    }
  };

  /**
   * Updates an existing checkpoint's data
   * @param {Array} newPlayerStats - [life, mana, morale, coin]
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  updateCheckpoint = async (newPlayerStats) => {
    try {
      await this.db.query(
        `UPDATE checkpoints 
         SET scene_id = $1, life = $2, mana = $3, morale = $4, coin = $5
         WHERE user_id = $6`,
        [this.sceneId, ...newPlayerStats, this.userId]
      );

      return ok("Checkpoint updated");
    } catch (err) {
      console.error("Database update error in updateCheckpoint:", err);
      return serverError();
    }
  };
}

export default CheckpointService;
