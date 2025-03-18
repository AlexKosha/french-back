import express from "express";
import { upload } from "../middlewares/index.js";
import { sendSpeech } from "../controllers/googleSpeechControllers.js";
import { convertToWav } from "../middlewares/convertToWav.js";

const googleSpeech = express.Router();

googleSpeech.post("/", upload.single("audio"), convertToWav, sendSpeech);

export default googleSpeech;
