import Joi from "joi";
import { errorMessageTemplate } from "../helpers/errorMessagesTemplate.js";

export const addProgressSchema = Joi.object({
  userId: Joi.string()
    .required()
    .label("UserId")
    .messages(errorMessageTemplate("UserId")),

  progress: Joi.object()
    .pattern(
      /^progress_[a-zA-Z0-9 _]+$/,
      Joi.object({
        updatedAt: Joi.number().required(),
        words: Joi.array()
          .items(
            Joi.object({
              world: Joi.string().required(),
              translationEN: Joi.string().required(),
              translationUK: Joi.string().required(),
              image: Joi.string().required(),
              audio: Joi.string().allow(""),
              themeId: Joi.string().required(),
              completed: Joi.array()
                .items(Joi.number().valid(1, 2, 3))
                .default([]),
              _id: Joi.string(), // якщо є
            })
          )
          .required(),
      })
    )
    .required()
    .label("Progress")
    .messages(errorMessageTemplate("Progress")),
});
