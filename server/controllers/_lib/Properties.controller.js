const Joi = require('joi');
const genResponse = require('../../genResponse');
const codes = require('../../codes');
const {
  createPropertyValidation,
  updatePropertyValidation
} = require('../../validation/properties.validation');
const { TokenUtils } = require('../../utils/Token.utils');

class PropertiesController {
  constructor({ users, properties }) {
    this.users = users;
    this.properties = properties;
    
    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.fetch = this.fetch.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }



  async create(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    try {
      const property = await this.properties.create(body);
      return genResponse(codes.CREATED, property);
    }
    catch(err) {
      return genResponse(codes.BAD_REQUEST, null, err);
    }
  }



  async list(req, res) {
    const { query } = req;

    if(!query || !query.token) {
      return genResponse(codes.MISSING_PARAMS);
    }

    let mongoQuery = {};

    Object.keys(query).forEach(key => {
      switch(key) {
        case 'areaFrom':
          if(!mongoQuery.area) mongoQuery.area = {};
          mongoQuery.area.$gte = query.areaFrom;
          break;
        case 'areaTo':
          if(!mongoQuery.area) mongoQuery.area = {};
          mongoQuery.area.$lte = query.areaTo;
          break;
        case 'bedroomsFrom':
          if(!mongoQuery.bedrooms) mongoQuery.bedrooms = {};
          mongoQuery.bedrooms.$gte = query.bedroomsFrom;
          break;
        case 'bedroomsTo':
          if(!mongoQuery.bedrooms) mongoQuery.bedrooms = {};
          mongoQuery.bedrooms.$lte = query.bedroomsTo;
          break;
        case 'priceFrom':
          if(!mongoQuery.price) mongoQuery.price = {};
          mongoQuery.price.$gte = query.priceFrom;
          break;
        case 'priceTo':
          if(!mongoQuery.price) mongoQuery.price = {};
          mongoQuery.price.$lte = query.priceTo;
          break;

        default: break;
      }
    })

    let decoded;

    try {
      decoded = TokenUtils.verify(query.token);
    }
    catch(e) {
      return genResponse(codes.INVALID_TOKEN);
    }

    if(decoded.role === 'client') mongoQuery.isRented = false;
    
    let response;

    try {
      const properties = await this.properties.find(mongoQuery).populate('realtorId');
      return genResponse(codes.OK, properties);
    }
    catch(err) {
      return genResponse(codes.INTERNAL_SERVER_ERROR, null, err);
    }
  }




  async fetch(req, res) {
    const { property_id } = req.params;

    if(!property_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    try {
      const property = await this.properties.findOne({ _id: property_id });
      return genResponse(codes.OK, property);
    }
    catch(err) {
      return genResponse(codes.PROPERTY_NOT_FOUND);
    }
  }




  async update(req, res) {
    const { property_id } = req.params;
    const { body } = req;

    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    if(!property_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    try {
      await this.properties.updateOne({ _id: property_id }, { $set: body });
      
      const property = await this.properties.findOne({ _id: property_id });
      return genResponse(codes.OK, property);
    }
    catch(err) {
      return genResponse(codes.UNPROCESSABLE_ENTITY, null, err);
    }

  }



  async remove(req, res) {
    const { property_id } = req.params;

    if(!property_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    try {
      await this.properties.deleteOne({ _id: property_id });
      return genResponse(codes.OK, { msg: `Object ${property_id} removed successfully.`, data: true });
    }
    catch(err) {
      if(err.name === `CastError`) {
        return genResponse(codes.INVALID_ID);
      } else {
        return genResponse(codes.UNPROCESSABLE_ENTITY);
      }
    }
  }
}

module.exports = PropertiesController;