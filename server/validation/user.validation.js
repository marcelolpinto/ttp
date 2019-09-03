const Joi = require('joi');

const createUserValidation = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  imageUrl: Joi.string(),
  password: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid("client", "realtor", "admin").required()
});

const updateUserValidation = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  password: Joi.string().min(3).max(30),
  imageUrl: Joi.string(),
  role: Joi.string().valid("client", "realtor", "admin")
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