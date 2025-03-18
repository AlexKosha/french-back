import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegStatic);

export const convertToWav = (req, res, next) => {
  if (!req.file) {
    return next(); // Якщо файл не передано, продовжуємо без змін
  }

  const inputPath = req.file.path;
  const outputPath = path.join(path.dirname(inputPath), `${Date.now()}.wav`);

  console.log(`🎤 Конвертація: ${inputPath} -> ${outputPath}`);

  ffmpeg(inputPath)
    .toFormat("wav")
    .audioCodec("pcm_s16le") // Google Speech API приймає тільки LINEAR16
    .audioChannels(1) // Примусово конвертуємо у МОНО
    .audioFrequency(16000) // Google рекомендує 16000 Hz
    .on("end", () => {
      console.log("✅ Конвертація завершена:", outputPath);

      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath); // Видаляємо оригінальний файл, якщо він є
      }

      req.file.path = outputPath; // Оновлюємо шлях файлу
      next();
    })
    .on("error", (err) => {
      console.error("❌ Помилка конвертації:", err);
      next(err);
    })
    .save(outputPath);
};
