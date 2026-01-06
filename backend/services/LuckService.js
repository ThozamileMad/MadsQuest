import { ok, notFound, serverError } from "../utils/response.js";

class LuckService {
  constructor(db, userId) {
    this.db = db;
    this.table = "luck";
    this.userId = Number(userId);
  }

  async getLuck() {
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

  async createLuck(stat) {
    try {
      // stats is expected to be an array with: [luck]
      await this.db.query(
        `INSERT INTO ${this.table}
         (user_id, luck)
         VALUES ($1, $2)`,
        [this.userId, stat]
      );

      return ok("Record created");
    } catch (err) {
      console.error(`DB error (createRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async updateLuck(stat) {
    try {
      // stats is expected to be an array with: [luck]
      await this.db.query(
        `UPDATE ${this.table}
         SET luck = $1
         WHERE user_id = $2`,
        [stat, this.userId]
      );

      return ok("Record updated");
    } catch (err) {
      console.error(`DB error (updateRecord - ${this.table}):`, err);
      return serverError();
    }
  }

  async deleteLuck() {
    try {
      await this.db.query(
        `DELETE FROM ${this.table}
         WHERE user_id = $1`,
        [this.userId]
      );

      return ok("Record deleted");
    } catch (err) {
      console.error(`DB error (deleteRecord - ${this.table}):`, err);
      return serverError();
    }
  }
}

export default LuckService;
