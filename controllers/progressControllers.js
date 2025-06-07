import { ctrlWrapper, HttpError } from "../helpers/index.js";
import * as progressServices from "../services/progressServices.js";

export const getProgress = ctrlWrapper(async (req, res) => {
  const progress = await progressServices.fetchProgressDB();
  res.json(progress);
});

export const addProgress = ctrlWrapper(async (req, res) => {
  const { userId, progress } = req.body;
  const ownerId = req.user.id || req.user._id; // авторизований користувач із токена

  if (userId !== ownerId.toString()) {
    throw HttpError(
      403,
      "Access denied. You can update only your own progress."
    );
  }

  const addProgress = await progressServices.addProgressDB(userId, progress);

  console.log(addProgress);

  res.status(200).json({
    progress: addProgress,
  });
});
