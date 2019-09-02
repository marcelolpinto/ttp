const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/toptal';
const JWT_SECRET = process.env.JWT_SECRET || 'gato';
const NODE_ENV = process.env.NODE_ENV || 'local';

module.exports = {
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV
};