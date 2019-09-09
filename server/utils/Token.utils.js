const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../global');

class TokenUtils {
  static sign(data = {}, expiresIn = 3600) {
    return jwt.sign(data, JWT_SECRET, { expiresIn });
  }

  static verify(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  static validateToken(req, res, next) {
    const { token } = req.query;
    if(!token) {
      res.status(400).send({ default: "BAD_REQUEST", msg: 'Missing token.' });
      return;
    }
    
    try {
      const isValid = jwt.verify(token, JWT_SECRET);
    } 
    catch(e) {
      res.status(401).send({ default: "UNAUTHORIZED", msg: 'Invalid token.' });
      return;
    }

    next();
  }
}

module.exports = { TokenUtils };