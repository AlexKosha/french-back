import { ctrlWrapper, HttpError } from "../helpers/index.js";
import * as vocabServices from "../services/vocabServices.js";

export const getVocab = ctrlWrapper(async (req, res) => {
  const vocab = await vocabServices.fetchVocabDB();
  res.json(vocab);
});

export const addWorld = ctrlWrapper(async (req, res) => {
  const newWorld = await vocabServices.addVocabDB(req.body);

  res.status(201).json(newWorld);
});

export const updateWorld = ctrlWrapper(async (req, res) => {
  const id = req.params.vocabId;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    throw HttpError(400, "missing field");
  }
  const updatedWorld = await vocabServices.updateVocabDB(id, body);
  res.json(updatedWorld);
});
