import { Schema, model } from "mongoose";

const themeShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    translationEN: {
      type: String,
      required: true,
    },
    translationUK: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timeseries: true }
);

export const ThemeModel = model("Thems", themeShema);
