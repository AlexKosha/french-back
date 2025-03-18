import { app } from "./app.js";
import { connectDB } from "./db/mongoConnect.js";
import { SpeechClient } from "@google-cloud/speech";
import dotenv from "dotenv";
import { serviceAccount } from "./config/service-account.js";

dotenv.config();
const { PORT } = process.env;

// Налаштування Google Cloud Speech Client
export const client = new SpeechClient({
  // keyFilename: path.resolve("config/service-account.js"),
  credentials: serviceAccount, // Передаємо credentials напряму
});

// Стартуємо сервер
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
