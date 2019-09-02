const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const genResponse = require('../../genResponse');
const codes = require('../../codes');
const {
  createUserValidation,
  updateUserValidation,
  authenticateValidation,
  changePasswordValidation
} = require('../../validation/user.validation');
const { JWT_SECRET } = require('../../global');

class UsersController {
  constructor({ users, meals }) {
    this.users = users;
    this.meals = meals;
    
    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.fetch = this.fetch.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.validate = this.validate.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async create(req, res) {
    const { body } = req;
    if(!body) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }
    
    const validation = Joi.validate(body, createUserValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }
    
    const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
    body.password = hashedPassword;

    const user = await this.users.create(body, (err, response) => {
      if(err) {
        console.log(err);
        const statusCode = { code: 'MONGO_CREATE_ERROR', msg: err.errors ? err.errors.role.name : err.errmsg };
        res.send(genResponse(statusCode, null));
      } else {
        delete response.password;
        res.send(genResponse(codes.OK, response));
      }
    });
  }

  async list(req, res) {
    let response;
    const users = await this.users.find({}).sort({ created_at: -1 });

    if(!users) response = genResponse({
      code: 'MONGO_LIST_ERROR',
      msg: 'list users error.'
    }, null);
    else response = genResponse(codes.OK, users);

    res.send(response);
  }

  async fetch(req, res) {
    const { user_id } = req.params;
    let response;
    const user = await this.users.findOne({ _id: user_id });

    if(!user) response = genResponse({
      code: 'MONGO_FETCH_ERROR',
      msg: 'fetch user error.'
    }, null);
    else response = genResponse(codes.OK, user);

    res.send(response)
  }

  async update(req, res) {
    const { user_id } = req.params;
    const { body } = req;

    if(!Object.keys(body).length) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }

    const validation = Joi.validate(body, updateUserValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }
    
    if(body.password) {
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }

    this.users.update({ _id: user_id }, { $set: body }, (err, response) => {
      if(err) {
        const statusCode = { code: 'MONGO_UPDATE_ERROR', msg: err.errors ? err.errors.role.name : err.errmsg };
        res.send(genResponse(statusCode, null));
      } else {
        delete response.password;
        res.send(genResponse(codes.OK, response));
      }
    });
  }

  async delete(req, res) {
    const { user_id } = req.params;

    const user = await this.users.findOne({ _id: user_id }, { role: 1 }, { lean: true });
    if(!user) {
      res.send(genResponse(statusCode.USER_NOT_FOUND), null);
      return;
    }

    if(user.role === 'admin') {
      const allAdmins = await this.users.find({ role: 'admin' });
      if(allAdmins.length === 1) {
        res.send(genResponse(codes.LAST_ADMIN, null));
        return;
      }
    }

    let statusCode;
    this.meals.deleteMany({ user_id }, (err, response) => {
      if(err) {
        statusCode = { code: 'MONGO_DELETE_ERROR', msg: err.errors.role.name };
        res.send(genResponse(statusCode, null));
      } else {
        this.users.deleteOne({ _id: user_id }, (err2, res2) => {
          if(err2) {
            statusCode = { code: 'MONGO_DELETE_ERROR', msg: err2.errors.role.name };
            res.send(genResponse(statusCode, null));
          } else {
            res.send(genResponse(codes.OK, res2));
          }
        })
      }
    });
  }

  async authenticate(req, res) {
    const { body } = req;
    if(!body) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }

    const validation = Joi.validate(body, authenticateValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }

    const user = await this.users.findOne({ email: body.email }, {}, { lean: true });
    if(!user) {
      res.send(genResponse(codes.USER_NOT_FOUND));
      return;
    }

    const isValid = bcrypt.compareSync(body.password, user.password);
      
    if(isValid) {
      const token = jwt.sign(user, JWT_SECRET);
      delete user.password;
      res.send(genResponse(codes.OK, { user, token }));
    } else {
      res.send(genResponse(codes.INVALID_CREDENTIALS, null));
    }
  }

  async validate(req, res) {
    const { user_id, token } = req.query;
    if(!user_id || !token) {
      res.send(genResponse(codes.MISSING_PARAMS, null))
      return;
    }

    const user = await this.users.findOne({ _id: user_id }, { password: 0 }, { lean: true }, err => {
      if(err) {
        res.send(genResponse(codes.MONGO_ERROR, null));
        return;
      }
    });
    if(!user) {
      res.send(genResponse(codes.USER_NOT_FOUND));
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
    }
    catch(e) {
      res.send(genResponse(codes.INVALID_TOKEN, null));
      return;
    }

    const newToken = jwt.sign(user, JWT_SECRET);
    delete user.password;
    res.send(genResponse(codes.OK, { user, token: newToken }));
  }

  async changePassword(req, res) {
    const { body, params: { user_id } } = req;
    if(!Object.keys(body).length) {
      res.send(genResponse(codes.EMTPY_BODY, null));
      return;
    }
    
    const validation = Joi.validate(body, changePasswordValidation);
    if(validation.error) {
      const details = validation.error.details.map(({ message }) => message);
      res.send(genResponse(codes.VALIDATION_ERROR, null, details));
      return;
    }
    
    const user = await this.users.findOne({ _id: user_id }, {}, { lean: true });
    if(!user) {
      res.send(genResponse(codes.USER_NOT_FOUND));
      return;
    }
    
    const isValid = bcrypt.compareSync(body.old_password, user.password);
    
    if(isValid) {
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      this.users.update({ _id: user_id }, { $set: { password: hashedPassword } }, (err, response) => {
        if(err) {
          const statusCode = { code: 'MONGO_UPDATE_ERROR', msg: err.errors.role.name };
          res.send(genResponse(statusCode, null));
        } else {
          res.send(genResponse(codes.OK, response));
        }
      })
    } else {
      res.send(genResponse(codes.WRONG_OLD_PASSWORD, null));
    }
  }
}

module.exports = UsersController;