const Joi = require('joi');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { S3 } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

const genResponse = require('../../genResponse');
const codes = require('../../codes');
const {
  createUserValidation,
  updateUserValidation,
  authenticateValidation,
  changePasswordValidation
} = require('../../validation/user.validation');
const {
  JWT_SECRET,
  BASE_URL,
  FB_ACCESS_TOKEN,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID
} = require('../../global');
const { TokenUtils } = require('../../utils/Token.utils');

class UsersController {
  constructor({ users, properties, mailer }) {
    this.users = users;
    this.properties = properties;
    this.mailer = mailer;
    
    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.fetch = this.fetch.bind(this);
    this.fetchByEmail = this.fetchByEmail.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authenticateSocialMedia = this.authenticateSocialMedia.bind(this);
    this.validate = this.validate.bind(this);
    this.invite = this.invite.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }



  async create(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });
    
    if(body.origin === 'form') {
      if(!body.password) res.status(400).send({ msg: 'Password is required.' })

      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }
    
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
        const token = TokenUtils.sign(response);
        
        if(body.origin === 'form') {
          this.mailer.sendMail({
            to: body.email,
            subject: 'TTP - Validate your account',
            html: `<p>Click <a href="${BASE_URL}/validate?_id=${response._id}token=${token}">here</a> to activate your account.</p>`
          })
        }

        res.send(genResponse(codes.OK, response));
      }
    });
  }



  async list(req, res) {
    let response;
    const users = await this.users.find({}, { password: 0 }).sort({ created_at: -1 });

    if(!users) response = genResponse(codes.INTERNAL_SERVER_ERROR, null);
    else response = genResponse(codes.OK, users);

    res.status(response.code).send(response);
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

    await this.users.deleteOne({ _id: user_id });

    res.send(genResponse(codes.OK), true);
    // let statusCode;
    // this.properties.deleteMany({ user_id }, (err, response) => {
    //   if(err) {
    //     statusCode = { code: 'MONGO_DELETE_ERROR', msg: err.errors.role.name };
    //     res.send(genResponse(statusCode, null));
    //   } else {
    //     this.users.deleteOne({ _id: user_id }, (err2, res2) => {
    //       if(err2) {
    //         statusCode = { code: 'MONGO_DELETE_ERROR', msg: err2.errors.role.name };
    //         res.send(genResponse(statusCode, null));
    //       } else {
    //         res.send(genResponse(codes.OK, res2));
    //       }
    //     })
    //   }
    // });
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
      const token = TokenUtils.sign(user);

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



  async authenticateSocialMedia(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });

    let socialMediaCheck;
    switch(body.origin) {
      case 'google': {
        await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${body.accessToken}`)
        .then(res => socialMediaCheck = true)
        .catch(err => socialMediaCheck = false);
        break;
      }

      case 'facebook': {
        await axios.get(`https://graph.facebook.com/debug_token?%20input_token=${body.accessToken}%20&access_token=${FB_ACCESS_TOKEN}`)
        .then(res => socialMediaCheck = true)
        .catch(err => socialMediaCheck = false);
        break;
      }

      default: break;
    }

    if(!socialMediaCheck) {
      res.status(401).send(codes.INVALID_ACCESS_TOKEN);
      return;
    }

    const user = await this.users.findOne({ _id: body.user_id }, {}, { lean: true });
    if(!user) {
      res.status(404).send(genResponse(codes.USER_NOT_FOUND));
      return;
    }

    if(user.status !== 'active') await this.users.updateOne({ _id: body.user_id }, { $set: { status: 'active' }});

    delete user.password;
    delete user.origin;

    const token = TokenUtils.sign(user);
    res.send(genResponse(codes.OK, { user, token }));
  }



  async validate(req, res) {
    const { user_id, token } = req.query;
    if(!user_id || !token) {
      res.status(400).send({ msg: "Body can't be empty." });
      return;
    }

    const user = await this.users.findOne({ _id: user_id }, { password: 0 }, { lean: true }, err => {
      if(err) {
        if(err.name === `CastError`) {
          res.status(400).send({ msg: 'Invalid user id.' });
          return;
        }
        res.status(400).send({ msg: 'Invalid request.' })
        return;
      }
    });
    if(!user) {
      res.status(404).send(genResponse(codes.USER_NOT_FOUND));
      return;
    }
    
    try {
      const decoded = TokenUtils.verify(token);
    }
    catch(e) {
      res.status(401).send(genResponse(codes.INVALID_TOKEN, null));
      return;
    }

    const newToken = TokenUtils.sign(user);
    delete user.password;
    res.send(genResponse(codes.OK, { user, token: newToken }));
  }



  async invite(req, res) {
    const { email, role } = req.body;
    if(!email || !role) {
      res.status(400).send({ msg: "Body can't be empty." });
      return;
    }

    console.log(req.body)

    const user = await this.users.create(
      { email, role, status: 'invited' },
       async (err, response) => {
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
          const token = TokenUtils.sign({ ...response });
          
          await this.mailer.sendMail({
            to: email,
            subject: 'TTP - Invitation to join',
            html: `<p>Click <a href="${BASE_URL}/complete-user?user_id=${response._id}&token=${token}&email=${email}">here</a> to complete your account and join.</p>`
          })

          res.send(genResponse(codes.OK, response));
        }
      }
    )
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


  async uploadImage(req, res) {
    const { body } = req;
    const { user_id } = req.params;
    if(!Object.keys(body).length) res.status(400).send({ msg: "Body can't be empty." });

    const image = body.image[0];
    
    const imageData = await new Promise((resolve, reject) => {
			fs.readFile(image.path, (err, data) => {
				if(err)	reject(err);
				else resolve(data);
			});
    });

    const extension = image.path.split('.').pop();

    const s3 = new S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });

    const imageUrl = await new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: 'ttp-profile-images',
        Key: `${user_id}.${extension}`,
        Body: imageData
      }, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Successfully uploaded profile image to s3`);
          resolve(`https://s3-sa-east-1.amazonaws.com/ttp-profile-images/${user_id}.${extension}`);
        }
      })
    })

    if(!imageUrl) {
      res.status(500).send({ msg: 'AWS putObject error.' })
      return;
    }

    await this.users.updateOne({ _id: user_id }, { $set: { imageUrl } });
    const user = await this.users.findOne({ _id: user_id }, { password: 0 }, { lean: true });

    res.send(genResponse(codes.OK, user));
  }
}

module.exports = UsersController;