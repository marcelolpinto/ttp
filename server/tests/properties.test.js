const mongoose = require('mongoose');
const { expect } = require('chai');
const { PropertiesController } = require('../controllers');
const { TokenUtils } = require('../utils/Token.utils');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Properties } = require('../mongo/schemas/Properties.schema');
const { Users } = require('../mongo/schemas/Users.schema');
var MockExpressResponse = require('mock-express-response');
 
// Basic usage
var mockedRes = new MockExpressResponse();

const propertiesController = new PropertiesController({
  properties: Properties,
  properties: Properties,
});

const EMPTY = { body: {}, params: {}, query: {} };
const PROPERTY_ID_PARAMS = { params: { property_id: 'id' } };

const CREATE_PROPERTY_SAMPLE = {
  name: 'Marcelo',
  realtorId: 'id',
  description: 'lorem ipsum',
  address: 'Rua alvarenga, 1096',
  lat: -23,
  lng: -46,
  bedrooms: 3,
  area: 60,
  price: 50000,
  placeId: 'id',
};

const LIST_PROPERTIES_SAMPLE = {
  query: {
    token: 'token'
  }
}

const EDIT_PROPERTY_SAMPLE = {
  NO_PARAMS: {
    body: CREATE_PROPERTY_SAMPLE,
    params: {}
  },
  OK: {
    body: CREATE_PROPERTY_SAMPLE,
    params: {
      property_id: 'id'
    }
  }
};

sinon.stub(jwt, 'sign').returns('token');

describe('Properties Controllers', function () {

  afterEach(() => { sinon.restore(); })
  
  describe('function create()', function () {

    it('should fail if empty body', async (done, db) => {
      done();
      const res = await propertiesController.create(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });
    
    it(`should create the property`, async done => {
      done();
      sinon.stub(Properties, 'create').returns(CREATE_PROPERTY_SAMPLE);
      const res = await propertiesController.create({ body: CREATE_PROPERTY_SAMPLE }, mockedRes);
      expect(res.code).to.equal(201);
    });

  });

  describe('function list()', () => {
    it('should fail with missing params error', async done => {
      done();
      const res = await propertiesController.list(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });
  });

  describe('function update()', () => {
    it('should fail with empty body', async done => {
      done();
      const res = await propertiesController.update(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with missing params', async done => {
      done();
      const res = await propertiesController.update(EDIT_PROPERTY_SAMPLE.NO_PARAMS, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should update the property', async done => {
      done();
      sinon.stub(TokenUtils, 'verify').returns(true);
      sinon.stub(Properties, 'updateOne').returns(true);
      sinon.stub(Properties, 'findOne').returns(EDIT_PROPERTY_SAMPLE.OK.body);

      const res = await propertiesController.update(EDIT_PROPERTY_SAMPLE.OK, mockedRes);
      expect(res.code).to.equal(200);
    });
  });



  describe('function remove()', () => {
    it('should fail with missing params', async done => {
      done();
      sinon.stub(Properties, 'findOne').returns(Promise.resolve(null));

      const res = await propertiesController.remove(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with invalid id', async done => {
      done();
      sinon.stub(Properties, 'deleteOne').returns(Promise.reject({ name: 'CastError' }));

      const res = await propertiesController.remove(PROPERTY_ID_PARAMS, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should delete the property', async done => {
      done();
      sinon.stub(Properties, 'findOne').returns(Promise.resolve({}));
      sinon.stub(Properties, 'deleteOne').returns(Promise.resolve(true));

      const res = await propertiesController.remove(PROPERTY_ID_PARAMS, mockedRes);
      expect(res.code).to.equal(200);
    });

  });

});