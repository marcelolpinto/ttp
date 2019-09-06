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
      res.status(400).send({ msg: 'Missing token.' });
      return;
    }
    
    const isValid = jwt.verify(token, JWT_SECRET);
    if(!isValid) {
      res.status(401).send({ msg: 'Invalid token.' });
      return;
    }
    console.log('isvalid', isValid);
    next();
  }
}

module.exports = { TokenUtils };