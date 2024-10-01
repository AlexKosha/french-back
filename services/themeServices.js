import { HttpError } from "../helpers/HttpError.js";
import { ThemeModel } from "../models/themeModal.js";

export const fetchThemeDB = () => ThemeModel.find();

export const addThemeDB = async (data) => {
  const exist = await ThemeModel.findOne({ name: data.name });

  if (exist) {
    throw HttpError(409, "Theme with such name already exists");
  }

  const newTheme = await ThemeModel.create({ ...data });

  return newTheme;
};

export const updateThemeDB = async (id, data) => {
  const updateTheme = await ThemeModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });

  if (!updateTheme) {
    throw HttpError(404, `Theme with id ${id} not found`);
  }

  return updateTheme;
};
