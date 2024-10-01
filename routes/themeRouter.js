import express from "express";
import { authenticate, validateBody, isValidId } from "../middlewares/index.js";
import * as schema from "../schemas/themeSchema.js";
import * as themeControllers from "../controllers/themeControllers.js";

const themeRouter = express.Router();

themeRouter.get("/", authenticate, themeControllers.getThems);

themeRouter.post(
  "/",
  authenticate,
  validateBody(schema.addThemeSchema),
  themeControllers.addTheme
);

themeRouter.put(
  "/:themeId",
  authenticate,
  isValidId,
  validateBody(schema.updateThemeSchema),
  themeControllers.updateTheme
);

export default themeRouter;
