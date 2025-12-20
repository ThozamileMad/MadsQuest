import { ok, notFound, serverError } from "../utils/response.js";

class GameProgressService {
  constructor(db, { table, sceneId, userId }) {
    this.db = db;
    this.table = table;
    this.sceneId = Number(sceneId);
    this.userId = Number(userId);
  }

  async getRecord() {
    try {
      const query = await this.db.query(
        `SELECT * FROM ${this.table} WHERE user_id = $1`,
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

  async createRecord(stats) {
    try {
      await this.db.query(
        `INSERT INTO ${this.table}
         (scene_id, user_id, life, mana, morale, coin)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [this.sceneId, this.userId, ...stats]
      );

      return ok("Record created");
    } catch (err) {
      console.error(`DB error (createRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async updateRecord(stats) {
    try {
      await this.db.query(
        `UPDATE ${this.table}
         SET scene_id = $1, life = $2, mana = $3, morale = $4, coin = $5
         WHERE user_id = $6`,
        [this.sceneId, ...stats, this.userId]
      );

      return ok("Record updated");
    } catch (err) {
      console.error(`DB error (updateRecord - ${this.table}):`, err);
      return serverError();
    }
  }
}

export default GameProgressService;
