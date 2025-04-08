import { Schema, model } from "mongoose";

const ConjugationSchema = new Schema({
  pronoun: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: true,
  },
});

const TenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  translationUA: {
    type: String,
    required: [true, "Ukrainian translation is required"],
  },
  translationEN: {
    type: String,
    required: [true, "English translation is required"],
  },
  conjugations: {
    type: [ConjugationSchema],
    required: true,
  },
});

const VerbSchema = new Schema(
  {
    infinitive: {
      type: String,
      required: [true, "Infinitive is required"],
      unique: true,
    },
    translationUA: {
      type: String,
      required: [true, "Ukrainian translation is required"],
    },
    translationEN: {
      type: String,
      required: [true, "English translation is required"],
    },
    tenses: {
      type: [TenseSchema],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const VerbModel = model("Verbs", VerbSchema);
