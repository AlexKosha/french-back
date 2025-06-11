import { ProgressModel } from "../models/progressModal.js";

export const userProgressUnique = async (userId) =>
  await ProgressModel.findOne({ userId }, { _id: 0 });

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

export const deleteProgress = async (userId) => {
  return await ProgressModel.deleteOne({ userId });
};
