module.exports = {
  OK: { code: 200, msg: 'OK' },

  MONGO_ERROR: { code: 600, msg: 'Mongo error' },
  VALIDATION_ERROR: { code: 601, msg: 'Validation error.' },
  INVALID_CREDENTIALS: { code: 602, msg: 'Invalid credentials.' },
  INVALID_TOKEN: { code: 603, msg: 'Invalid token.' },
  WRONG_OLD_PASSWORD: { code: 604, msg: 'The current password you provided is wrong.' },
  LAST_ADMIN: { code: 605, msg: 'You are currently the only admin. You should name at least one more user as admin to delete this account.' },
  
  USER_NOT_FOUND: { code: 650, msg: 'User not found.' },
  EMTPY_BODY: { code: 700, msg: "Body can't be empty." },
  MISSING_PARAMS: { code: 701, msg: 'One or more parameters are missing.' },
};