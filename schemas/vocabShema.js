import Joi from "joi";
import { errorMessageTemplate } from "../helpers/errorMessagesTemplate.js";

export const addWorldtoVocabSchema = Joi.object({
  world: Joi.string()
    .required()
    .label("World")
    .message(errorMessageTemplate("World")),
  translationEN: Joi.string()
    .required()
    .label("trEN")
    .message(errorMessageTemplate("trEN")),
  translationUK: Joi.string()
    .required()
    .label("trUK")
    .message(errorMessageTemplate("trUK")),
  image: Joi.string()
    .required()
    .label("Image")
    .message(errorMessageTemplate("Image")),
  audio: Joi.string()
    .required()
    .label("Audio")
    .message(errorMessageTemplate("Audio")),
});

export const updateWorld = Joi.object({
  world: Joi.string().label("World").messages({
    "string.empty": '"World" cannot be an empty field',
  }),
  translationEN: Joi.string().label("trEN").messages({
    "string.empty": '"trEN" cannot be an empty field',
  }),
  translationUK: Joi.string().label("trUK").messages({
    "string.empty": '"trUK" cannot be an empty field',
  }),
  image: Joi.string().label("Image").messages({
    "string.empty": '"Image" cannot be an empty field',
  }),
});