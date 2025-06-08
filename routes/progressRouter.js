import express from "express";
import { authenticate, validateBody } from "../middlewares/index.js";
import * as progressControllers from "../controllers/progressControllers.js";
import { addProgressSchema } from "../schemas/progressSchema.js";

const progressRouter = express.Router();

progressRouter.get("/", authenticate, progressControllers.getProgress);

progressRouter.post(
  "/",
  authenticate,
  validateBody(addProgressSchema),
  progressControllers.addProgress
);
progressRouter.patch(
  "/",
  authenticate,
  validateBody(addProgressSchema),
  progressControllers.updateProgressThemes
);

export default progressRouter;
