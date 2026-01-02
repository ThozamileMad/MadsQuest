/* General Modules */
import express from "express";
import pg from "pg";
import cors from "cors";
import session from "express-session";

/* Controller Modules */
import {
  createCheckpointProcess,
  returnToPreviousProcess,
  createLastChoiceProcess,
  restartGameProcess,
} from "./controllers/GameProgressController.js";
import { createSceneProcess } from "./controllers/SceneController.js";

const app = express();
const port = 5000;

// -------------------------------
// Middleware
// -------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
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
// Game Progression Routes
// -------------------------------

// Save checkpoint
app.post("/api/checkpoint/:sceneId/:userId", async (req, res) => {
  const sceneId = req.params.sceneId;
  const userId = req.params.userId;

  const response = await createCheckpointProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

// Return to last saved checkpoint
app.get("/api/return_to_previous/:table/:userId", async (req, res) => {
  const userId = req.params.userId;
  const table = req.params.table;

  const response = await returnToPreviousProcess(db, userId, table);
  console.log("response: ", response);

  return res.status(response.statusCode).json(response.result);
});

// Save last scene where the user last selected a choice
app.post("/api/last_choice/:sceneId/:userId", async (req, res) => {
  const sceneId = req.params.sceneId;
  const userId = req.params.userId;

  const response = await createLastChoiceProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

//
app.get("/api/restart_game/:userId", async (req, res) => {
  const userId = req.params.userId;

  const response = await restartGameProcess(db, userId);

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

app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port:", port);
});
