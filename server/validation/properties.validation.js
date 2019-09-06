const Joi = require('joi');

const createMealValidation = Joi.object().keys({
  name: Joi.string().required(),
  calories: Joi.number().min(1).required(),
  date: Joi.date().required(),
});

const updateMealValidation = Joi.object().keys({
  name: Joi.string(),
  calories: Joi.number().min(1),
  date: Joi.date(),
});

module.exports = {
  createMealValidation,
  updateMealValidation
};