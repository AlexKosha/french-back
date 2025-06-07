import { ProgressModel } from "../models/progressModal.js";

export const fetchProgressDB = () => ProgressModel.find();

export const addProgressDB = (userId, progress) => {
  const newProgress = ProgressModel.create({ userId, progress });

  return newProgress;
};
