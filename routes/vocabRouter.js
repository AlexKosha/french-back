import express from "express";
import { authenticate, validateBody, isValidId } from "../middlewares/index.js";
import * as schema from "../schemas/vocabShema.js";
import * as vocabControllers from "../controllers/vocabControllers.js";

const vocabRouter = express.Router();

vocabRouter.get("/", authenticate, vocabControllers.getVocab);

vocabRouter.post(
  "/",
  authenticate,
  validateBody(schema.addWorldtoVocabSchema),
  vocabControllers.addWorld
);

vocabRouter.put(
  "/:vocabId",
  authenticate,
  isValidId,
  validateBody(schema.updateWorld),
  vocabControllers.updateWorld
);

export default vocabRouter;
