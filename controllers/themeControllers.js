import { ctrlWrapper, HttpError } from "../helpers/index.js";
import * as themeServices from "../services/themeServices.js";

export const getThems = ctrlWrapper(async (req, res) => {
  const themes = await themeServices.fetchThemeDB();
  res.json(themes);
});

export const addTheme = ctrlWrapper(async (req, res) => {
  const newTheme = await themeServices.addThemeDB(req.body);

  res.status(201).json(newTheme);
});

export const updateTheme = ctrlWrapper(async (req, res) => {
  const id = req.params.themeId;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    throw HttpError(400, "missing field");
  }

  const updatedTheme = await themeServices.updateThemeDB(id, body);

  res.json(updateTheme);
});
