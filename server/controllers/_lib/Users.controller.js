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
    this.remove = this.remove.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authenticateSocialMedia = this.authenticateSocialMedia.bind(this);
    this.validate = this.validate.bind(this);
    this.invite = this.invite.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }



  async create(req, res, next) {
    const { body } = req;
    let response = null;

    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    if(body.origin === 'form' || body.origin === 'admin') {
      if(!body.password) {
        return genResponse(codes.INCOMPLETE_BODY);
      }

      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }

    try {
      const user = await this.users.create(body);

      const data = { ...user._doc };
      delete data.password;
      delete data.origin;
      delete data.__v;
      
      const token = TokenUtils.sign(data, 86400); // 1 day expiration
      
      if(body.origin === 'form') {
        this.mailer.sendMail({
          to: body.email,
          subject: 'TTP - Validate your account',
          html: `<p>Click <a href="${BASE_URL}/validate?user_id=${user._id}&token=${token}">here</a> to activate your account.<br/>This link expires in 1 day.</p>`
        })
      }
      
      return genResponse(codes.CREATED, data);
    }
    catch(err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate email
        return genResponse(codes.DUPLICATE_EMAIL);
      } else {
        // Some other error
        return genResponse(codes.UNPROCESSABLE_ENTITY);
      }
    }
  }



  async list(req, res) {
    try {
      const users = await this.users.find({}, { password: 0, origin: 0, __v: 0 });
      return genResponse(codes.OK, users);
    }
    catch(err) {
      return genResponse(codes.INTERNAL_SERVER_ERROR);
    }
  }



  async fetch(req, res) {
    const { user_id } = req.params;

    if(!user_id) {
      return genResponse(codes.MISSING_PARAMS);
    }
    
    try {
      const user = await this.users.findOne({ _id: user_id });

      delete user.loginAttempts;
      delete user.created_at;
      delete user.updated_at;
      delete user.password;
      delete user.origin;
      delete user.__v;
      
      return genResponse(codes.OK, user);
    }
    catch(err) {
      return genResponse(codes.USER_NOT_FOUND);
    }

  }



  async fetchByEmail(req, res) {
    const { email } = req.query;

    if(!email) {
      return genResponse(codes.MISSING_PARAMS);
    }
    
    try {
      const user = await this.users.findOne({ email });

      delete user.loginAttempts;
      delete user.created_at;
      delete user.updated_at;
      delete user.password;
      delete user.origin;
      delete user.__v;

      return genResponse(codes.OK, user);
    }
    catch(err) {
      return genResponse(codes.USER_NOT_FOUND_NO_TOAST);
    }

  }



  async update(req, res) {
    const { user_id } = req.params;
    const { body } = req;

    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    if(!user_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    if(body.password) {
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));
      body.password = hashedPassword;
    }

    try {
      const updated = await this.users.updateOne({ _id: user_id }, { $set: body });   
      const user = await this.users.findOne({ _id: user_id }, { password: 0, origin: 0, __v: 0 }, { lean: true });
      return genResponse(codes.OK, user);
    }
    catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return genResponse(codes.DUPLICATE_EMAIL);
      } else {
        return genResponse(codes.UNPROCESSABLE_ENTITY);
      }
    };
  }



  async remove(req, res) {
    const { user_id } = req.params;

    if(!user_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    let user;
    try {
      user = await this.users.findOne({ _id: user_id });
    }
    catch(err) {
      return genResponse(codes.USER_NOT_FOUND);
    }

    if(user.role === 'admin') {
      try {
        const allAdmins = await this.users.find({ role: 'admin' });
        if(allAdmins.length === 1) {
          return genResponse(codes.LAST_ADMIN);
        }
      }
      catch (err) {
        return genResponse(codes.USER_NOT_FOUND);        
      }
    }

    try {
      const deleteProperties = await this.properties.deleteMany({ realtorId: user_id });

      try {
        const deleteUser = await this.users.deleteOne({ _id: user_id });
        return genResponse(codes.OK, { data: true, msg: `User ${user_id} removed successfully.`, toast: true });
      }
      catch(err) {
        return genResponse(codes.UNPROCESSABLE_ENTITY);
      }
      
    }
    catch(err) {
      return genResponse(codes.UNPROCESSABLE_ENTITY);
    }
  }



  async authenticate(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    let user;
    try {
      user = await this.users.findOne({ email: body.email }, {},  { lean: true });
    }
    catch (err) {
      return genResponse(codes.USER_NOT_FOUND);
    }

    if(user.status === 'blocked') {
      return genResponse(codes.USER_BLOCKED);
    }

    if(user.status === 'pending') {
      return genResponse(codes.USER_PENDING);
    }

    if(user.origin !== 'form' && user.origin !== 'admin') {
      delete user.loginAttempts;
      delete user.created_at;
      delete user.updated_at;
      delete user.password;
      delete user.origin;
      delete user.__v;

      const token = TokenUtils.sign(user);

      await this.users.updateOne({ _id: user._id }, { $set: { loginAttempts: 0 }});

      return genResponse(codes.OK, { user, token });
    }

    const isValid = bcrypt.compareSync(body.password, user.password);
      
    if(isValid) {
      delete user.loginAttempts;
      delete user.created_at;
      delete user.updated_at;
      delete user.password;
      delete user.origin;
      delete user.__v;
      
      const token = TokenUtils.sign(user);

      await this.users.updateOne({ _id: user._id }, { $set: { loginAttempts: 0 }});

      return genResponse(codes.OK, { user, token });

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
          html: '<p>Your account was blocked.<br/>Contact a project admin to restore your active status.</p>'
        })
        
        return genResponse(codes.USER_BLOCKED);
      }

      return {
        code: 401,
        msg: `Wrong password. You have ${3 - count} attempt(s) left.`,
        data: null,
        toast: true
      };
    }
  }



  async authenticateSocialMedia(req, res) {
    const { body } = req;
    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

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
      return genResponse(codes.INVALID_ACCESS_TOKEN);
    }

    try {
      const user = await this.users.findOne({ _id: body.user_id }, {}, { lean: true });

      const update = { loginAttempts: 0 };
      
      if(user.status !== 'active') update.status = 'active';
      await this.users.updateOne({ _id: body.user_id }, { $set: update });
  
      delete user.loginAttempts;
      delete user.created_at;
      delete user.updated_at;
      delete user.password;
      delete user.origin;
      delete user.__v;
  
      const token = TokenUtils.sign(user);
      return genResponse(codes.OK, { user, token });
    }
    catch(err) {
      return genResponse(codes.USER_NOT_FOUND);
    }

  }



  async validate(req, res) {
    const { user_id, token } = req.query;
    if(!user_id || !token) {
      return genResponse(codes.MISSING_PARAMS);
    }

    let user;
    try {
      user = await this.users.findOne({ _id: user_id }, { password: 0 }, { lean: true })
    }
    catch(err) {
      if(err.name === `CastError`) {
        return genResponse(codes.INVALID_ID);
      }
      return genResponse(codes.BAD_REQUEST);
    }

    if(!user) {
      return genResponse(codes.USER_NOT_FOUND);
    }
    
    try {
      const decoded = TokenUtils.verify(token);
    }
    catch(e) {
      return genResponse(codes.INVALID_TOKEN);
    }

    const newToken = TokenUtils.sign(user);
    delete user.loginAttempts;
    delete user.created_at;
    delete user.updated_at;
    delete user.password;
    delete user.origin;
    delete user.__v;
    
    return genResponse(codes.OK, { user, token: newToken });
  }



  async invite(req, res) {
    const { email, role } = req.body;
    if(!email || !role) {
      return genResponse(codes.INCOMPLETE_BODY);
    }

    let user;
    try {
      user =  await this.users.create({ email, role, status: 'invited' });  
      const to = { ...user._doc };

      delete to.loginAttempts;
      delete to.created_at;
      delete to.updated_at;
      delete to.password;
      delete to.origin;
      delete to.__v;

      const token = TokenUtils.sign(to);
      
      await this.mailer.sendMail({
        to: email,
        subject: 'TTP - Invitation to join',
        html: `<p>Click <a href="${BASE_URL}/complete-user?user_id=${to._id}&token=${token}&email=${email}">here</a> to complete your account and join.</p>`
      })

      return genResponse(codes.CREATED, to);
    }
    catch(err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate email
        return genResponse(codes.DUPLICATE_EMAIL);
      }
  
      // Some other error
      return genResponse(codes.UNPROCESSABLE_ENTITY, null, err);
    }
  }



  async changePassword(req, res) {
    const { body, params: { user_id } } = req;
    
    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

    if(!user_id) {
      return genResponse(codes.MISSING_PARAMS);
    }

    let user;
    try {
      user = await this.users.findOne({ _id: user_id }, {}, { lean: true });
    }
    catch(err) {
      return genResponse(codes.USER_NOT_FOUND);
    }  
    
    const isValid = user.password ? bcrypt.compareSync(body.old_password, user.password) : true;
    
    if(isValid) {
      const hashedPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8));

      try {
        const updated = await this.users.updateOne({ _id: user_id }, { $set: { password: hashedPassword } });

        delete user.loginAttempts;
        delete user.created_at;
        delete user.updated_at;
        delete user.password;
        delete user.origin;
        delete user.__v;
  
        return genResponse(codes.OK, user);
      }
      catch(err) {
        return genResponse(codes.BAD_REQUEST, null, err);
      }
    } else {
      return genResponse(codes.WRONG_OLD_PASSWORD);
    }
  }

  

  async uploadImage(req, res) {
    const { body } = req;
    const { user_id } = req.params;

    if(!Object.keys(body).length) {
      return genResponse(codes.EMPTY_BODY);
    }

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
          console.log('image upload error', err);
          reject(err);
        } else {
          console.log(`Successfully uploaded profile image to s3`);
          resolve(`https://s3-sa-east-1.amazonaws.com/ttp-profile-images/${user_id}.${extension}`);
        }
      })
    })

    if(!imageUrl) {
      return genResponse(codes.AWS_ERROR);
    }

    try {
      await this.users.updateOne({ _id: user_id }, { $set: { imageUrl } });
      const user = await this.users.findOne({ _id: user_id }, { password: 0, origin: 0, __v: 0, loginAttempts: 0, created_at: 0, updated_at: 0 }, { lean: true });

      return genResponse(codes.OK, user);
    }
    catch(err) {
      return genResponse(codes.UNPROCESSABLE_ENTITY, null, err);
    }
  }
}

module.exports = UsersController;