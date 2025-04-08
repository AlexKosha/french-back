import { ctrlWrapper } from "../helpers/index.js";
import * as verbServices from "../services/verbServices.js";

export const getVerb = ctrlWrapper(async (req, res) => {
  const verbs = await verbServices.fetchVerbs();

  res.json(verbs);
});

export const addVerb = ctrlWrapper(async (req, res) => {
  const newVerb = await verbServices.addVerb(req.body);

  res.status(201).json(newVerb);
});
