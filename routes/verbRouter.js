import express from "express";
import { authenticate, validateBody } from "../middlewares/index.js";
import * as schema from "../schemas/verbSchema.js";
import * as verbControllers from "../controllers/verbControllers.js";

const verbRouter = express.Router();

verbRouter.get("/", authenticate, verbControllers.getVerb);

verbRouter.post("/", authenticate, verbControllers.addVerb);

export default verbRouter;
