import { HttpError } from "../helpers/HttpError.js";
import { VerbModel } from "../models/verbModal.js";

export const fetchVerbs = () => VerbModel.find();

export const addVerb = async (data) => {
  const exist = await VerbModel.findOne({ infinitive: data.infinitive });

  if (exist) throw HttpError(409, "Verb with such name already exists");

  const newVerb = await VerbModel.create({ ...data });

  return newVerb;
};
