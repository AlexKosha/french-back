import fs from "fs";
import wav from "wav-decoder";
import { client } from "../server.js";
import { ctrlWrapper, HttpError } from "../helpers/index.js";

export const sendSpeech = ctrlWrapper(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  // Читаємо файл
  const audioBuffer = fs.readFileSync(req.file.path);

  // Декодуємо WAV, щоб отримати sampleRate
  const audioData = await wav.decode(audioBuffer);
  const sampleRate = audioData.sampleRate; // Отримуємо реальну частоту дискретизації

  const audioBytes = audioBuffer.toString("base64");

  // Виклик Google API
  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: sampleRate, // Використовуємо реальну частоту дискретизації
      languageCode: "en-US",
    },
  };

  const [response] = await client.recognize(request);
  const transcript = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  res.json({ transcript });

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("❌ Помилка видалення файлу:", err);
    } else {
      console.log("🗑️ Тимчасовий файл видалено:", req.file.path);
    }
  });
});
