import express from "express";
import { upload } from "../middlewares/index.js";
import { sendSpeech } from "../controllers/googleSpeechControllers.js";

const googleSpeech = express.Router();

googleSpeech.post("/", upload.single("audio"), sendSpeech);

export default googleSpeech;
