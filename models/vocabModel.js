import { Schema, model } from "mongoose";

const vocabShema = new Schema(
  {
    world: {
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
    image: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: true,
    },
    themeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { versionKey: false, timeseries: true }
);

export const VocabModel = model("Vocabulary", vocabShema);
