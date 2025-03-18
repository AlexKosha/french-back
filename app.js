import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import vocabRouter from "./routes/vocabRouter.js";
import themeRouter from "./routes/themeRouter.js";
import googleSpeechRouter from "./routes/googleSpeechRouter.js";

dotenv.config();

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/users", authRouter);
app.use("/vocab", vocabRouter);
app.use("/theme", themeRouter);
app.use("/speech-to-text", googleSpeechRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
