import { ctrlWrapper, HttpError } from "../helpers/index.js";
import * as progressServices from "../services/progressServices.js";

export const getProgress = ctrlWrapper(async (req, res) => {
  const progress = await progressServices.userProgressUnique(req.user.id);
  res.json(progress);
});

export const addProgress = ctrlWrapper(async (req, res) => {
  const { userId, progress } = req.body;
  const ownerId = req.user.id || req.user._id; // авторизований користувач із токена

  const ifProgressExist = await progressServices.userProgressUnique(userId);

  if (ifProgressExist) {
    throw HttpError(409, "Progress for such user already in use");
  }

  if (userId !== ownerId.toString()) {
    throw HttpError(
      403,
      "Access denied. You can update only your own progress."
    );
  }

  const addProgress = await progressServices.addProgressDB(userId, progress);

  res.status(200).json({
    progress: addProgress,
  });
});

export const updateProgressThemes = ctrlWrapper(async (req, res) => {
  const { userId, progress: incomingProgress } = req.body;
  const ownerId = req.user.id || req.user._id;

  if (userId !== ownerId.toString()) {
    throw HttpError(
      403,
      "Access denied. You can update only your own progress."
    );
  }

  const existing = await progressServices.userProgressUnique(userId);

  // Якщо прогрес не існує — створюємо
  if (!existing) {
    const newProgress = await progressServices.addProgressDB(
      userId,
      incomingProgress
    );
    return res.status(201).json(newProgress);
  }

  // Очистити від Mongoose-метаданих
  const existingProgress = JSON.parse(JSON.stringify(existing.progress));

  // Об'єднати старі й нові теми
  const updatedProgress = {
    ...existingProgress,
    ...incomingProgress,
  };

  // Оновити документ у базі
  const updated = await progressServices.updateProgressThemesDB(
    userId,
    updatedProgress
  );

  res.status(200).json(updated);
});
