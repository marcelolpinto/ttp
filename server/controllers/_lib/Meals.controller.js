const Joi = require('joi');
const genResponse = require('../../genResponse');
const codes = require('../../codes');
const {
  createMealValidation,
  updateMealValidation
} = require('../../validation/meals.validation');

class MealsController {
  constructor({ users, meals }) {
    this.users = users;
    this.meals = meals;
    
    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.fetch = this.fetch.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  create(req, res) {
    if(!Object.keys(req.body).length) {
      return res.send(genResponse(codes.EMTPY_BODY, null));
    }

    const validation = Joi.validate(req.body, createMealValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }

    const { user_id } = req.params;
    const body = {
      ...req.body,
      user_id
    };

    let statusCode, response;
    this.meals.create(body, (err, response) => {
      if(err) {
        statusCode = { code: 'MONGO_CREATE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        res.send(genResponse(codes.OK, response));
      }
    });
  }

  async list(req, res) {
    const { user_id } = req.params;

    if(!user_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null));
      return;
    }

    let response;
    const meals = await this.meals.find({ user_id }).sort({ date: -1 });

    if(!meals) response = genResponse({
      code: 'MONGO_LIST_ERROR',
      msg: 'list meals error.'
    }, null);
    else response = genResponse(codes.OK, meals);

    res.send(response);
  }

  async fetch(req, res) {
    const { user_id, meal_id } = req.params;
    
    if(!user_id || !meal_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    let response;
    const meal = await this.meals.findOne({ user_id, _id: meal_id }, err => {
      if(err) {
        res.send({ code: 'MONGO_ERR', msg: err });
        return;
      }
    });

    if(!meal) response = genResponse({
      code: 'MONGO_FETCH_ERROR',
      msg: 'fetch meal error.'
    }, null);
    else response = genResponse(codes.OK, meal);

    res.send(response)
  }

  async update(req, res) {
    const { user_id, meal_id } = req.params;
    const { body } = req
   
    if(!user_id || !meal_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    if(!Object.keys(body).length) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }

    const validation = Joi.validate(body, createMealValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }

    this.meals.update({ _id: meal_id }, { $set: body }, (err, response) => {
      if(err) {
        const statusCode = { code: 'MONGO_UPDATE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        res.send(genResponse(codes.OK, response));
      }
    });
  }

  delete(req, res) {
    const { user_id, meal_id } = req.params;

    if(!user_id || !meal_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    let statusCode;
    this.meals.deleteOne({ _id: meal_id }, (err, response) => {
      if(err) {
        statusCode = { code: 'MONGO_DELETE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        res.send(genResponse(codes.OK, response));
      }
    });
  }
}

module.exports = MealsController;