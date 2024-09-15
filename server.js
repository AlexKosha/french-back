import { app } from "./app.js";
import { connectDB } from "./db/mongoConnect.js";

const port = process.env.PORT ?? 2025;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running. use our API on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
