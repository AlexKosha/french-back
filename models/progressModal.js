import { Schema, model } from "mongoose";

const WordSchema = new Schema({
  world: String,
  translationEN: String,
  translationUK: String,
  image: String,
  audio: String,
  themeId: String,
  completed: [Number],
});

const TopicProgressSchema = new Schema(
  {
    updatedAt: Number,
    words: [WordSchema],
  },
  { _id: false }
);

const ProgressSchema = new Schema(
  {
    userId: { type: String, required: true },
    progress: {
      type: Map,
      of: TopicProgressSchema, // ✅ очікує об’єкт з updatedAt + words
    },
  },
  { versionKey: false, timeseries: true }
);

export const ProgressModel = model("Progress", ProgressSchema);
