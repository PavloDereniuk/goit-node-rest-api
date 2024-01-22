import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "co", "uk"] },
    })
    .required(),
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email({
    minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "co", "uk"] },
  }),
  phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
});

export default {
  createContactSchema,
  updateContactSchema,
};
