import Joi from "joi";
import { errorMessageTemplate } from "../helpers/errorMessagesTemplate.js";

const emailRegex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

export const registerSchema = Joi.object({
  name: Joi.string().required().messages(errorMessageTemplate("Name")),
  email: Joi.string().required().pattern(emailRegex).messages({
    "string.pattern.base": "Incorrect email format",
    "string.empty": '"email" cannot be an empty field',
    "any.required": 'missing required field "email"',
  }),
  birthDate: Joi.date().less("now").required().messages({
    "date.base": '"birthDate" must be a valid date',
    "date.less": '"birthDate" must be in the past',
    "any.required": 'missing required field "birthDate"',
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": '"password" cannot be an empty field',
    "string.min": '"password" should have a minimum length of 6',
    "any.required": 'missing required field "password"',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegex).messages({
    "string.pattern.base": "Incorrect email format",
    "string.empty": '"email" cannot be an empty field',
    "any.required": 'missing required field "email"',
  }),
  password: Joi.string().required().messages(errorMessageTemplate("Password")),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": '"name" cannot be an empty field',
  }),
  email: Joi.string().pattern(emailRegex).messages({
    "string.pattern.base": "Incorrect email format",
    "string.empty": '"email" cannot be an empty field',
  }),
});

export const updateThemeSchema = Joi.object({
  theme: Joi.string().required().valid("dark", "light").messages({
    "string.empty": '"theme" cannot be an empty field',
    "any.required": 'missing required field "theme"',
  }),
});

export const updatePassword = Joi.object({
  password: Joi.string().required().min(6).messages({
    "string.empty": '"password" cannot be an empty field',
    "string.min": '"password" should have a minimum length of 6',
    "any.required": 'missing required field "password"',
  }),
  newPassword: Joi.string().required().min(6).messages({
    "string.empty": '"password" cannot be an empty field',
    "string.min": '"password" should have a minimum length of 6',
    "any.required": 'missing required field "password"',
  }),
});

export const restorePassword = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "Incorrect email format",
    "string.empty": '"email" cannot be an empty field',
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": '"password" cannot be an empty field',
    "string.min": '"password" should have a minimum length of 6',
    "any.required": 'missing required field "password"',
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).messages({
    "string.pattern.base": "Incorrect email format",
    "string.empty": '"email" cannot be an empty field',
  }),
});

export const avatarUpdateSchema = Joi.object({
  avatarURL: Joi.any(),
});
