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
import {
  getLuckProcess,
  updateLuckProcess,
  boostStatsProcess,
} from "./controllers/LuckController.js";
import {
  getAchievementsProcess,
  unlockAchievementProcess,
} from "./controllers/AchievementController.js";

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
// Scene Routes
// -------------------------------

/**
 * GET /api/scene/:sceneId/:userId
 * Retrieves or initializes the scene process for the given user.
 */
app.get("/api/scene/:sceneId/:userId/:updateStats", async (req, res) => {
  const sceneId = Number(req.params.sceneId);
  const userId = Number(req.params.userId);
  const updateStats = req.params.updateStats === "true";

  const response = await createSceneProcess(db, userId, sceneId, updateStats);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Game Progression Routes
// -------------------------------

// Save checkpoint
app.post("/api/checkpoint/:sceneId/:userId", async (req, res) => {
  const sceneId = Number(req.params.sceneId);
  const userId = Number(req.params.userId);

  const response = await createCheckpointProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

// Return to last saved checkpoint
app.get("/api/return_to_previous/:table/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const table = req.params.table;

  const response = await returnToPreviousProcess(db, userId, table);
  console.log("response: ", response);

  return res.status(response.statusCode).json(response.result);
});

// Save last scene where the user last selected a choice
app.post("/api/last_choice/:sceneId/:userId", async (req, res) => {
  const sceneId = Number(req.params.sceneId);
  const userId = Number(req.params.userId);

  const response = await createLastChoiceProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

//
app.get("/api/restart_game/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  const response = await restartGameProcess(db, userId);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Luck Routes
// -------------------------------

// Gets current player luck
app.get("/api/get_luck/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  const response = await getLuckProcess(db, userId);

  return res.status(response.statusCode).json(response.result);
});

// Updates current player luck
app.post("/api/update_luck/:userId/:luck", async (req, res) => {
  const userId = Number(req.params.userId);
  const luck = req.params.luck;

  const response = await updateLuckProcess(db, userId, luck);

  return res.status(response.statusCode).json(response.result);
});

// Boosts a players stats
app.post("/api/boost_stats/:userId/:boost_amount/:stat", async (req, res) => {
  const userId = Number(req.params.userId);
  const boostAmount = Number(req.params.boost_amount);
  const stat = req.params.stat;

  const response = await boostStatsProcess(db, userId, boostAmount, stat);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Achievement Routes
// -------------------------------

// Get all locked and unlocked achievements
app.get("/api/get_achievements/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  const response = await getAchievementsProcess(db, userId);

  return res.status(response.statusCode).json(response.result);
});

// Unlocks player achievements
app.post("/api/unlock_achievement/:userId/:sceneId", async (req, res) => {
  const userId = Number(req.params.userId);
  const sceneId = Number(req.params.sceneId);

  const response = await unlockAchievementProcess(db, userId, sceneId);

  return res.status(response.statusCode).json(response.result);
});

// -------------------------------
// Server Startup
// -------------------------------

app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port:", port);
});
