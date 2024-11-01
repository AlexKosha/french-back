import Joi from "joi";
import { errorMessageTemplate } from "../helpers/errorMessagesTemplate.js";

export const addThemeSchema = Joi.object({
  name: Joi.string()
    .required()
    .label("Name")
    .messages(errorMessageTemplate("Name")),
  translationEN: Joi.string()
    .required()
    .label("trEN")
    .messages(errorMessageTemplate("trEN")),
  translationUK: Joi.string()
    .required()
    .label("trUK")
    .messages(errorMessageTemplate("trUK")),
});
export const updateThemeSchema = Joi.object({
  name: Joi.string().label("Name").messages({
    "string.empty": '"Name" cannot be an empty field',
  }),
  translationEN: Joi.string().label("trEN").messages({
    "string.empty": '"trEN" cannot be an empty field',
  }),
  translationUK: Joi.string().label("trUK").messages({
    "string.empty": '"trUK" cannot be an empty field',
  }),
});
