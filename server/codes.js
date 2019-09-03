module.exports = {
  OK: { code: 200, msg: 'OK' },

  MONGO_ERROR: { code: 600, msg: 'Mongo error' },
  VALIDATION_ERROR: { code: 601, msg: 'Validation error.' },
  INVALID_CREDENTIALS: { code: 401, msg: 'Invalid credentials.' },
  INVALID_TOKEN: { code: 401, msg: 'Invalid token.' },
  WRONG_OLD_PASSWORD: { code: 604, msg: 'The current password you provided is wrong.' },
  LAST_ADMIN: { code: 605, msg: 'You are currently the only admin. You should name at least one more user as admin to delete this account.' },
  
  USER_NOT_FOUND: { code: 404, msg: "User not found.", toast: true },
  USER_BLOCKED: { code: 401, msg: "User is blocked. Contact admin to restore status.", toast: true },
  USER_PENDING: { code: 401, msg: "User account validation is pending. Please verify your email.", toast: true },
  USER_NOT_FOUND_NO_TOAST: { code: 404, msg: "User not found.", toast: false },
  EMTPY_BODY: { code: 700, msg: "Body can't be empty." },
  MISSING_PARAMS: { code: 701, msg: 'One or more parameters are missing.' },
};