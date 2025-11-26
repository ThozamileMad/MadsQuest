import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import createCheckpointProcess from "./controllers/CheckpointController";
import createSceneProcess from "./controllers/SceneController";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const db = new pg.Client({
  user: "postgres",
  password: "MadPostgres@2",
  host: "localhost",
  port: "5432",
  database: "madsquest",
});

db.connect();

// GET checkpoint for a specific scene and user
app.get("/api/checkpoint/:scene_id/:user_id", async (req, res) => {
  const sceneId = req.params.scene_id;
  const userId = req.params.user_id;

  // Execute the checkpoint process workflow
  const response = await createCheckpointProcess(db, sceneId, userId);

  return res.status(response.statusCode).json(response.result);
});

// GET scene for a specific scene and user
app.get("/api/scene/:scene_id/:user_id", async (req, res) => {
  const sceneId = req.params.scene_id;
  const userId = req.params.user_id;

  // Execute the scene process workflow
  const response = await createSceneProcess(db, userId, sceneId);

  return res.status(response.statusCode).json(response.result);
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
