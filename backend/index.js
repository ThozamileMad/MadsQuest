import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

import createCheckpointProcess from "./controllers/CheckpointController.js";
import createSceneProcess from "./controllers/SceneController.js";

const app = express();
const port = 5000;

// -------------------------------
// Middleware
// -------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// -------------------------------
// Database Connection
// -------------------------------
const db = new pg.Client({
  user: "postgres",
  password: "MadPostgres@2",
  host: "localhost",
  port: "5432",
  database: "madsquest",
});

db.connect();

// -------------------------------
// Checkpoint Routes
// -------------------------------

/**
 * GET /api/checkpoint/:sceneId/:userId
 * Runs the checkpoint process for a specific user and scene.
 */
app.get("/api/checkpoint/:sceneId/:userId", async (req, res) => {
  const sceneId = req.params.sceneId;
  const userId = req.params.userId;

  const response = await createCheckpointProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Scene Routes
// -------------------------------

/**
 * GET /api/scene/:sceneId/:userId
 * Retrieves or initializes the scene process for the given user.
 */
app.get("/api/scene/:sceneId/:userId", async (req, res) => {
  const sceneId = req.params.sceneId;
  const userId = req.params.userId;

  const response = await createSceneProcess(db, userId, sceneId);
  console.log(response);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Server Startup
// -------------------------------
app.listen(port, () => {
  console.log("Listening on port:", port);
});
