import express from "express";
import pg from "pg";
import cors from "cors";
import session from "express-session";

import {
  createCheckpointProcess,
  getCheckpointData,
} from "./controllers/CheckpointController.js";
import createSceneProcess from "./controllers/SceneController.js";
import { ok } from "./utils/response.js";

const app = express();
const port = 5000;

// -------------------------------
// Middleware
// -------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(
  session({
    secret: "MadSecret@2",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // *** Set to true if using HTTPS ***//
    },
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

/**
 * GET /api/get_checkpoint/:sceneId/:userId
 * Runs the checkpoint process for a specific user and scene.
 */
app.get("/api/get_checkpoint/:userId", async (req, res) => {
  const sceneId = 0;
  const userId = req.params.userId;

  const response = await getCheckpointData(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Scene Routes
// -------------------------------

/**
 * GET /api/scene/:sceneId/:userId
 * Retrieves or initializes the scene process for the given user.
 */
app.get("/api/scene/:sceneId/:userId/:updateStats", async (req, res) => {
  const sceneId = req.params.sceneId;
  const userId = req.params.userId;
  const updateStats = req.params.updateStats === "true";

  const response = await createSceneProcess(db, userId, sceneId, updateStats);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Server Startup
// -------------------------------

app.listen(port, () => {
  console.log("Listening on port:", port);
});
