const mongoose = require('mongoose');
const { expect } = require('chai');
const { UsersController } = require('../controllers');
const { TokenUtils } = require('../utils/Token.utils');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../mongo/schemas/Users.schema');
const { Properties } = require('../mongo/schemas/Properties.schema');
var MockExpressResponse = require('mock-express-response');
 
// Basic usage
var mockedRes = new MockExpressResponse();

const usersController = new UsersController({
  users: Users,
  properties: Properties,
  mailer: {}
});

const EMPTY = { body: {}, params: {}, query: {} };
const USER_ID_PARAMS = { params: { user_id: 'id' } };

const CREATE_USER_SAMPLE = {
  name: 'Marcelo',
  email: 'dummy90@gmail.com',
  password: 'marcelo123',
  role: 'client',
  origin: 'admin',
};

const EDIT_USER_SAMPLE = {
  NO_PARAMS: {
    body: {
      name: 'Marcelo X Edit',
      email: 'dummy90@gmail.com',
    },
    params: {}
  },
  OK: {
    body: {
      name: 'Marcelo X Edit',
      email: 'dummy90@gmail.com',
    },
    params: {
      user_id: 'id'
    }
  }
};

const AUTH_SAMPLE = {
  body: {
    email: 'email',
    password: 'password'
  }
}

const VALIDATE_SAMPLE = {
  query: {
    user_id: 'id',
    token: 'token'
  }
}

const CHANGE_PASSWORD_SAMPLE = {
  body: {
    old_password: 'wow',
    password: 'such wow'
  },
  params: {
    user_id: 'id',
  }
}

describe('Users Controllers', function () {

  afterEach(() => { sinon.restore(); })

  describe('function create()', function () {

    it('should fail if empty body', async (done, db) => {
      done();
      const res = await usersController.create(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });
    
    it(`should fail with duplicate email`, async done => {
      done();
      const stub = sinon.stub(Users, 'create').returns(Promise.reject({
        name: 'MongoError',
        code: 11000
      }));

      const res = await usersController.create({ body: CREATE_USER_SAMPLE }, mockedRes);
      expect(res.code).to.equal(422);
    });

    
    it(`should fail incomplete body`, async done => {
      done();
      const res = await usersController.create({ body: { origin: 'form' } }, mockedRes);
      expect(res.code).to.equal(400);
    });

    it(`should create the user`, async done => {
      done();
      const stub = sinon.stub(Users, 'create').returns(CREATE_USER_SAMPLE);
      const res = await usersController.create({ body: CREATE_USER_SAMPLE }, mockedRes);
      expect(res.code).to.equal(201);
    });

  });

  

  describe('function list()', () => {
    it('should fail with internal server error', async done => {
      done();
      const stub = sinon.stub(Users, 'find').returns(Promise.reject({}));
      const res = await usersController.list({}, mockedRes);
      expect(res.code).to.equal(500);      
    });

    it('should get the user', async done => {
      done();
      const stub = sinon.stub(Users, 'find').returns(CREATE_USER_SAMPLE);
      const res = await usersController.list({}, mockedRes);

      expect(res.code).to.equal(200);
      expect(res.data).to.equal(CREATE_USER_SAMPLE);
    });
  });



  describe('function update()', () => {
    it('should fail with empty body', async done => {
      done();
      const res = await usersController.update(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with missing params', async done => {
      done();
      const res = await usersController.update(EDIT_USER_SAMPLE.NO_PARAMS, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with duplicate email', async done => {
      done();
      const stub = sinon.stub(Users, 'updateOne').returns(Promise.reject({
        name: 'MongoError',
        code: 11000
      }));;
      const res = await usersController.update(EDIT_USER_SAMPLE.OK, mockedRes);
      expect(res.code).to.equal(422); 
    });

    it('should update the user', async done => {
      done();
      const updateStub = sinon.stub(Users, 'updateOne').returns(true);
      const findOneStub = sinon.stub(Users, 'findOne').returns(EDIT_USER_SAMPLE.OK.body);

      const res = await usersController.update(EDIT_USER_SAMPLE.OK, mockedRes);
      expect(res.code).to.equal(200);
      expect(res.data).to.equal(EDIT_USER_SAMPLE.OK.body);
    });
  });



  describe('function remove()', () => {
    it('should fail with missing params', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns(Promise.resolve(null));

      const res = await usersController.remove(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with user not found', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns(Promise.reject(null));

      const res = await usersController.remove(USER_ID_PARAMS, mockedRes);
      expect(res.code).to.equal(404);
    });

    it('shoud fail when deleting last "admin"', async done => {
      done();
      const findOneStub = sinon.stub(Users, 'findOne').returns({ role: 'admin' });
      const findStub = sinon.stub(Users, 'find').returns([1]);

      const res = await usersController.remove(USER_ID_PARAMS, mockedRes);
      expect(res.code).to.equal(422);
    });

    it('should delete the user', async done => {
      done();
      const userFindStub = sinon.stub(Users, 'findOne').returns(Promise.resolve({}));
      const userDeleteStub = sinon.stub(Users, 'deleteOne').returns(Promise.resolve());
      const propertiesDeleteStub = sinon.stub(Properties, 'deleteMany').returns(Promise.resolve());

      const res = await usersController.remove(USER_ID_PARAMS, mockedRes);
      expect(res.code).to.equal(200);
    });
  });



  describe('function validate()', () => {
    it('should fail with missing params', async done => {
      done();
      const res = await usersController.validate(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('shoudl fail with user not found', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns(null);

      const res = await usersController.validate(VALIDATE_SAMPLE, mockedRes);
      expect(res.code).to.equal(404);
    });

    it('should validate the token', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns(Promise.resolve(CREATE_USER_SAMPLE));
      const verifyStub = sinon.stub(TokenUtils, 'verify').returns(true);

      const res = await usersController.validate(VALIDATE_SAMPLE, mockedRes);
      expect(res.code).to.equal(200);
    });
  });



  describe('function authenticate()', () => {
    it('should fail with empty body', async done => {
      done();
      const res = await usersController.authenticate(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with blocked user', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns({ status: 'blocked' });

      const res = await usersController.authenticate(AUTH_SAMPLE, mockedRes);
      expect(res.code).to.equal(401)
    });

    it('should fail with pending user', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns({ status: 'pending' });

      const res = await usersController.authenticate(AUTH_SAMPLE, mockedRes);
      expect(res.code).to.equal(401)
    });

    it('should fail with invalid password', async done => {
      done();
      const usersStub = sinon.stub(Users, 'findOne').returns(Promise.resolve({}));
      const bcryptStub = sinon.stub(bcrypt, 'compareSync').returns(false);
      const res = await usersController.authenticate(AUTH_SAMPLE, mockedRes);

      expect(res.code).to.equal(401)
    });

    it('should authenticate the user', async done => {
      done();
      const updateStub = sinon.stub(Users, 'updateOne').returns(true);

      const res = await usersController.authenticate(AUTH_SAMPLE, mockedRes); 
      expect(res.code).to.equal(200);
    })
  });



  describe("function changePassword()", () => {

    it('shoud fail with empty body', async done => {
      done();
      const res = await usersController.changePassword(EMPTY, mockedRes);
      expect(res.code).to.equal(400);
    });

    it('should fail with user not found', async done => {
      done();
      const stub = sinon.stub(Users, 'findOne').returns(Promise.reject(null));
      const updateStub = sinon.stub(Users, 'updateOne').returns(true);

      const res = await usersController.changePassword(CHANGE_PASSWORD_SAMPLE, mockedRes);
      expect(res.code).to.equal(404);
    });

    it('should fail with wrong old password', async done => {
      done();
      const userStub = sinon.stub(Users, 'findOne').returns(Promise.resolve({ password: 'abc' }));
      const bcryptStub = sinon.stub(bcrypt, 'compareSync').returns(false);

      const res = await usersController.changePassword(CHANGE_PASSWORD_SAMPLE, mockedRes);
      expect(res.code).to.equal(422);
    });

    it('should change password', async done => {
      done();
      const userStub = sinon.stub(Users, 'findOne').returns(CREATE_USER_SAMPLE);
      const hashSyncStub = sinon.stub(bcrypt, 'hashSync').returns('wow');
      const updateStub = sinon.stub(Users, 'updateOne').returns(Promise.resolve(true));
      
      const res = await usersController.changePassword(CHANGE_PASSWORD_SAMPLE, mockedRes);
      expect(res.code).to.equal(200);
    });
  });
});