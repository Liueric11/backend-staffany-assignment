import Joi from "joi";

export const idDto = Joi.object({
  id: [Joi.string().required(), Joi.number().integer().required()],
});

export const startDateDto = Joi.object({
  startDate: Joi.string()
    .required()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "startDate must be in the format YYYY-MM-DD",
      "any.required": "startDate is required",
    }),
});


export * from "./filter";
export * from "./shift";
