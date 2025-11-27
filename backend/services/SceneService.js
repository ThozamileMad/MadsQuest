import { ok, notFound, serverError } from "../utils/response.js";

class SceneService {
  constructor(db, sceneId) {
    this.db = db;
    this.sceneId = Number(sceneId);
  }

  /**
   * Fetches scene data by ID from the database
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  getScene = async () => {
    try {
      const query = await this.db.query("SELECT * FROM scenes WHERE id = $1", [
        this.sceneId,
      ]);

      if (query.rows.length === 0) {
        // Return empty array if no scene found
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error("Database error in getScene:", err);
      return serverError();
    }
  };

  /**
   * Retrieves all choices available for a specific scene
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  getChoices = async () => {
    try {
      const query = await this.db.query(
        "SELECT * FROM choices WHERE scene_id = $1",
        [this.sceneId]
      );

      if (query.rows.length === 0) {
        // Return empty array if no choices found
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error("Database error in getChoices:", err);
      return serverError();
    }
  };

  /**
   * Fetches effects associated with choices in a scene
   * @returns {Promise<Object>} Promise resolving to { success: boolean, result: any, statusCode: number }
   */
  getChoiceEffects = async () => {
    try {
      const query = await this.db.query(
        "SELECT * FROM choice_effects WHERE scene_id = $1",
        [this.sceneId]
      );

      if (query.rows.length === 0) {
        // Return empty array if no effects found
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error("Database error in getChoiceEffects:", err);
      return serverError();
    }
  };
}

export default SceneService;
