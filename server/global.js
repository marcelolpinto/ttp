const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/toptal';
const JWT_SECRET = process.env.JWT_SECRET || 'gato';
const NODE_ENV = process.env.NODE_ENV || 'local';
const MAILER_SENDER = process.env.MAILER_SENDER;
const MAILER_PASS = process.env.MAILER_PASS;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;

module.exports = {
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV,
  MAILER_PASS,
  MAILER_SENDER,
  FB_ACCESS_TOKEN,
  BASE_URL,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID
};