import Joi from "joi";
import { errorMessageTemplate } from "../helpers/errorMessagesTemplate.js";

export const addThemeSchema = Joi.object({
  name: Joi.string()
    .required()
    .label("Name")
    .messages(errorMessageTemplate("Name")),
});
export const updateThemeSchema = Joi.object({
  name: Joi.string().label("Name").messages({
    "string.empty": '"Name" cannot be an empty field',
  }),
});
