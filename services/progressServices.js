import { ProgressModel } from "../models/progressModal.js";

export const userProgressUnique = async (userId) =>
  await ProgressModel.findOne({ userId });

export const addProgressDB = (userId, progress) => {
  const newProgress = ProgressModel.create({ userId, progress });

  return newProgress;
};

export const updateProgressThemesDB = async (userId, progress) => {
  return await ProgressModel.findOneAndUpdate(
    { userId },
    { $set: { progress } },
    { new: true }
  );
};
