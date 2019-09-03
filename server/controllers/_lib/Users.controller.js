const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
  constructor({ users, meals, mailer }) {
    this.users = users;
    this.meals = meals;
    this.mailer = mailer;
    
    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.fetch = this.fetch.bind(this);
    this.fetchByEmail = this.fetchByEmail.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.validate = this.validate.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }



  async create(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });
    
    if(body.origin === 'form') {
      if(!body.password) res.status(400).send({ msg: 'Password is required.' })

      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }

    body.status = {
      form: 'pending'
    }[body.origin] || 'active';

    const user = await this.users.create(body, (err, response) => {
      if(err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          return res.status(422).send({ msg: 'This email is already taken. Try another one.' });
        }
  
        // Some other error
        return res.status(422).send({ ...err, msg: 'Unprocessable entity.' });
      } else {
        delete response.password;
        delete response.origin;
        delete response.__v;
        const token = jwt.sign({ ...response, expires: (new Date()).getTime() + (3600 * 1000) }, JWT_SECRET)
        
        this.mailer.sendMail({
          to: body.email,
          subject: 'TTP - Validate your account',
          html: `<p>Click <a href="http://localhost:3000/validate?_id=${response._id}token=${token}">here</a> to activate your account.</p>`
        })

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

    if(!user) response = genResponse(codes.USER_NOT_FOUND, null);    
    else {
      delete user.password;
      delete user.origin;      
      response = genResponse(codes.OK, user);
    }

    res.status(response.code).send(response);
  }



  async fetchByEmail(req, res) {
    const { email } = req.query;
    let response;
    const user = await this.users.findOne({ email });

    if(!user) response = genResponse(codes.USER_NOT_FOUND_NO_TOAST, null);
    else {
      delete user.password;
      delete user.origin;
      response = genResponse(codes.OK, user);
    }

    res.status(response.code).send(response);
  }



  async update(req, res) {
    const { user_id } = req.params;
    const { body } = req;
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });

    // const validation = Joi.validate(body, updateUserValidation);
    // if(validation.error) {
    //   const details = validation.error.details.map(({ msg }) => msg);
    //   res.send(genResponse(codes.VALIDATION_ERROR, null, details));
    //   return;
    // }
    
    if(body.password) {
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }

    this.users.update({ _id: user_id }, { $set: body }, (err, response) => {
      if(err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          return res.status(422).send({ msg: 'This email is already taken. Try another one.', toast: true });
        }
  
        // Some other error
        return res.status(422).send({ ...err, msg: 'Unprocessable entity.' });
      } else {
        delete response.password;
        delete response.origin;
        delete response.__v;
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
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });

    // const validation = Joi.validate(body, authenticateValidation);
    // if(validation.error) {
    //   const details = validation.error.details.map(({ msg }) => msg);
    //   res.send(genResponse(codes.VALIDATION_ERROR, null, details));
    //   return;
    // }

    const user = await this.users.findOne({ email: body.email }, {});
    if(!user) {
      res.status(404).send(genResponse(codes.USER_NOT_FOUND));
      return;
    }

    if(user.status === 'blocked') {
      const response = genResponse(codes.USER_BLOCKED, null);
      res.status(response.code).send(response);
      return;
    }

    if(user.status === 'pending') {
      const response = genResponse(codes.USER_PENDING, null);
      res.status(response.code).send(response);
      return;
    }

    const isValid = bcrypt.compareSync(body.password, user.password);
      
    if(isValid) {
      delete user.password;
      delete user.origin;
      const token = jwt.sign({ ...user, expires: (new Date()).getTime() + (3600 * 1000) }, JWT_SECRET);
      this.users.update({ _id: user._id }, { $set: { loginAttempts: 0 }});
      res.send(genResponse(codes.OK, { user, token }));
    } else {
      const count = Math.min(user.loginAttempts + 1, 3);
      const update = { $set: { loginAttempts: count }};
      if(count === 3)
        update.$set.status = 'blocked';


      const updated = await this.users.updateOne({ _id: user._id }, update)

      if(count === 3) {
        this.mailer.sendMail({
          to: body.email,
          subject: "Account blocked",
          html: '<p>Your account was blocked someone tried to access it unsuccesfully 3 times.<br/>Contact a project admin to restore your active status.</p>'
        })
        res.status(401).send({ msg: 'User was blocked due to many login attempts. Contact admin to restore active status.' })
        return;
      }
      res.status(401).send(genResponse(codes.INVALID_CREDENTIALS, null));
    }
  }



  async validate(req, res) {
    const { user_id, token } = req.query;
    if(!user_id || !token) {
      res.status(400).send({ msg: "Body can't be empty." });
    }

    const user = await this.users.findOne({ _id: user_id }, { password: 0 }, { lean: true }, err => {
      if(err) {
        if(err.name === `CastError`) res.status(400).send({ msg: 'Invalid user id.' });
        res.status(400).send({ msg: 'Invalid request.' })
        return;
      }
    });
    if(!user) {
      res.status(404).send(genResponse(codes.USER_NOT_FOUND));
      return;
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if(decoded.expires < (new Date()).getTime()) 
        return res.status(401).send({ msg: 'Token expired.' })
    }
    catch(e) {
      res.status(401).send(genResponse(codes.INVALID_TOKEN, null));
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
      const details = validation.error.details.map(({ msg }) => msg);
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