module.exports = {
  OK: { code: 200, msg: 'OK' },

  MONGO_ERROR: { code: 600, msg: 'Mongo error' },
  VALIDATION_ERROR: { code: 601, msg: 'Validation error.' },

  INVALID_FORM_DATA: { code: 400, msg: 'Invalid object sent to upload.' },

  INVALID_CREDENTIALS: { code: 401, msg: 'Invalid credentials.' },
  INVALID_TOKEN: { code: 401, msg: 'Invalid token.' },
  INVALID_ACCESS_TOKEN: { code: 401, msg: 'Invalid access token.' },
  USER_BLOCKED: { code: 401, msg: "User is blocked. Contact admin to restore status.", toast: true },
  USER_PENDING: { code: 401, msg: "User account validation is pending. Please verify your email.", toast: true },
  
  USER_NOT_FOUND_NO_TOAST: { code: 404, msg: "User not found.", toast: false },
  USER_NOT_FOUND: { code: 404, msg: "User not found.", toast: true },
  
  INTERNAL_SERVER_ERROR: { code: 500, msg: 'Internal server error. Try again in a few minutes.' },
  
  WRONG_OLD_PASSWORD: { code: 604, msg: 'The current password you provided is wrong.' },
  
  EMTPY_BODY: { code: 700, msg: "Body can't be empty." },
  MISSING_PARAMS: { code: 701, msg: 'One or more parameters are missing.' },
};