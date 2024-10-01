import { HttpError } from "../helpers/HttpError.js";
import { VocabModel } from "../models/vocabModel.js";

export const fetchVocabDB = () => VocabModel.find();

export const addVocabDB = async (data) => {
  const exist = await VocabModel.findOne({ world: data.world });

  if (exist) {
    throw HttpError(409, "Such a word is already in the dictionary");
  }

  const newWorld = await VocabModel.create({ ...data });

  return newWorld;
};

export const updateVocabDB = async (id, data) => {
  const updateWorld = await VocabModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });

  if (!updateWorld) {
    throw HttpError(404, `World with id ${id} not found`);
  }

  return updateWorld;
};
