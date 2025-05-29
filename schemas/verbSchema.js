import Joi from "joi";

const conjugationSchema = Joi.object({
  pronoun: Joi.string().required(),
  form: Joi.string().required(),
  ending: Joi.string().required(),
});

const tenseSchema = Joi.object({
  name: Joi.string()
    .valid("Présent", "Passé composé", "Imparfait", "Futur simple")
    .required(),
  translationUA: Joi.string().required(),
  translationEN: Joi.string().required(),
  conjugations: Joi.array().items(conjugationSchema).min(1).required(),
});

export const addVerbSchema = Joi.object({
  infinitive: Joi.string().required(),
  translationUA: Joi.string().required(),
  translationEN: Joi.string().required(),
  tenses: Joi.array().items(tenseSchema).min(1).required(),
});
