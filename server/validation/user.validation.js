const Joi = require('joi');

const createUserValidation = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(30).required(),
  confirm_password: Joi.string().min(3).max(30),
  max_calories: Joi.number().min(1).required(),
  role: Joi.string().valid("user", "manager", "admin").required()
});

const updateUserValidation = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  max_calories: Joi.number().min(1),
  password: Joi.string().min(3).max(30),
  confirm_password: Joi.string().min(3).max(30),
  role: Joi.string().valid("user", "manager", "admin")
});

const authenticateValidation = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required()
});

const changePasswordValidation = Joi.object().keys({
  old_password: Joi.string().required(),
  password: Joi.string().required().min(3).max(30)
});

module.exports = {
  createUserValidation,
  updateUserValidation,
  authenticateValidation,
  changePasswordValidation
};