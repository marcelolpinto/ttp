const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../global');
const codes = require('../codes');
const genResponse = require('../genResponse');
  
class Guard {
  constructor(notAllowed) {
    this.notAllowed = notAllowed;

    this.guard = this.guard.bind(this);
  }

  guard(req, res, next) {
    const { token } = req.query;

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } 
    catch(e) {
      res.status(401).send(genResponse(codes.INVALID_TOKEN));
      return;
    }

    const { role } = decoded;

    if (this.notAllowed.includes(role)) {
      return res.status(403).send(genResponse(codes.FORBIDDEN));
    }

    next();
  }
}

module.exports = { Guard };