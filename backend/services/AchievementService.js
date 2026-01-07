import { ok, notFound, serverError } from "../utils/response.js";

class AchievementService {
  constructor(db, userId) {
    this.db = db;
    this.table = "achievements";
    this.joinTable = "player_achievements";
    this.userId = Number(userId);
  }

  async getAchievement(sceneId) {
    try {
      const query = await this.db.query(
        `SELECT * FROM ${this.table} WHERE scene_id = $1`,
        [sceneId]
      );

      if (query.rows.length === 0) {
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error(`DB error (getRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async getAllAchievements() {
    try {
      const query = await this.db.query(`SELECT * FROM ${this.table}`);

      if (query.rows.length === 0) {
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error(`DB error (getRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async getPlayerAchievements() {
    try {
      const query = await this.db.query(
        `
        SELECT a.*
        FROM ${this.table} a
        JOIN ${this.joinTable} pa ON pa.achievement_id = a.id
        WHERE pa.user_id = $1
        `,
        [this.userId]
      );

      if (query.rows.length === 0) {
        return notFound([]);
      }

      return ok(query.rows);
    } catch (err) {
      console.error(`DB error (getRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async createAchievement(achievementId) {
    try {
      await this.db.query(
        `
        INSERT INTO ${this.joinTable}
        (user_id, achievement_id)
        VALUES ($1, $2)
        `,
        [this.userId, achievementId]
      );

      return ok("Record created");
    } catch (err) {
      console.error(`DB error (createRecord - ${this.joinTable}):`, err);
      return serverError();
    }
  }

  async deleteAchievement(achievementId) {
    try {
      await this.db.query(
        `
        DELETE FROM ${this.joinTable}
        WHERE user_id = $1 AND achievement_id = $2
        `,
        [this.userId, achievementId]
      );

      return ok("Record deleted");
    } catch (err) {
      console.error(`DB error (deleteRecord - ${this.joinTable}):`, err);
      return serverError();
    }
  }
}

export default AchievementService;
