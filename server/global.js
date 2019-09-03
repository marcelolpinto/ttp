const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/toptal';
const JWT_SECRET = process.env.JWT_SECRET || 'gato';
const NODE_ENV = process.env.NODE_ENV || 'local';
const MAILER_SENDER = process.env.MAILER_SENDER;
const MAILER_PASS = process.env.MAILER_PASS;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = {
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV,
  MAILER_PASS,
  MAILER_SENDER,
  BASE_URL
};