const Joi = require('joi');
const genResponse = require('../../genResponse');
const codes = require('../../codes');
const {
  createPropertyValidation,
  updatePropertyValidation
} = require('../../validation/properties.validation');

class PropertiesController {
  constructor({ users, properties }) {
    this.users = users;
    this.properties = properties;
    
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

    const validation = Joi.validate(req.body, createPropertyValidation);
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
    this.properties.create(body, (err, response) => {
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
    const properties = await this.properties.find({ user_id }).sort({ date: -1 });

    if(!properties) response = genResponse({
      code: 'MONGO_LIST_ERROR',
      msg: 'list properties error.'
    }, null);
    else response = genResponse(codes.OK, properties);

    res.send(response);
  }

  async fetch(req, res) {
    const { user_id, property_id } = req.params;
    
    if(!user_id || !property_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    let response;
    const property = await this.properties.findOne({ user_id, _id: property_id }, err => {
      if(err) {
        res.send({ code: 'MONGO_ERR', msg: err });
        return;
      }
    });

    if(!property) response = genResponse({
      code: 'MONGO_FETCH_ERROR',
      msg: 'fetch property error.'
    }, null);
    else response = genResponse(codes.OK, property);

    res.send(response)
  }

  async update(req, res) {
    const { user_id, property_id } = req.params;
    const { body } = req
   
    if(!user_id || !property_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    if(!Object.keys(body).length) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }

    const validation = Joi.validate(body, createPropertyValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }

    this.properties.update({ _id: property_id }, { $set: body }, (err, response) => {
      if(err) {
        const statusCode = { code: 'MONGO_UPDATE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        res.send(genResponse(codes.OK, response));
      }
    });
  }

  delete(req, res) {
    const { user_id, property_id } = req.params;

    if(!user_id || !property_id) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    let statusCode;
    this.properties.deleteOne({ _id: property_id }, (err, response) => {
      if(err) {
        statusCode = { code: 'MONGO_DELETE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        res.send(genResponse(codes.OK, response));
      }
    });
  }
}

module.exports = PropertiesController;