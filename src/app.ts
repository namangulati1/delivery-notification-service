import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";
import logger from "./utils/logger";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
