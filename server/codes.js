module.exports = {
  OK: { code: 200, default: "OK", msg: 'OK' },
  CREATED: { code: 201, default: "CREATED", msg: 'Created entity.' },

  LAST_ADMIN: { code: 422, default: 'UNPROCESSABLE_ENTITY', msg: "Can't delete last admin on platform. Assign another user as admin to proceed.", toast: true },

  BAD_REQUEST: { code: 400, default: 'BAD_REQUEST', msg: "Bad request." },
  EMPTY_BODY: { code: 400, default: 'BAD_REQUEST', msg: "Body can't be empty." },
  INCOMPLETE_BODY: { code: 400, default: 'BAD_REQUEST', msg: "Body is missing required fields." },
  MISSING_PARAMS: { code: 400, default: 'BAD_REQUEST', msg: "Missing url parameters." },
  INVALID_FORM_DATA: { code: 400, default: 'BAD_REQUEST', msg: 'Invalid object sent to upload.' },
  INVALID_ID: { code: 400, default: 'BAD_REQUEST', msg: 'Invalid id.' },

  INVALID_CREDENTIALS: { code: 401, default: 'UNAUTHORIZED', msg: 'Invalid credentials.' },
  INVALID_TOKEN: { code: 401, default: 'UNAUTHORIZED', msg: 'Invalid token.' },
  INVALID_ACCESS_TOKEN: { code: 401, default: 'UNAUTHORIZED', msg: 'Invalid social media access token.' },
  USER_BLOCKED: { code: 401, default: 'UNAUTHORIZED', msg: "User is blocked. Contact admin to restore status.", toast: true },
  USER_PENDING: { code: 401, default: 'UNAUTHORIZED', msg: "User account validation is pending. Please verify your email.", toast: true },

  FORBIDDEN: { code: 403, default: 'FORBIDDEN', msg: "This role can't perform this action." },
  
  USER_NOT_FOUND_NO_TOAST: { code: 404, msg: "User not found.", toast: false },
  USER_NOT_FOUND: { code: 404, msg: "User not found.", toast: true },
  PROPERTY_NOT_FOUND: { code: 404, msg: "Property not found.", toast: true },
  DUPLICATE_EMAIL: { code: 422, default: 'UNPROCESSABLE_ENTITY', msg: 'This email is already taken. Try another one.', toast: true },
  UNPROCESSABLE_ENTITY: { code: 422, default: 'UNPROCESSABLE_ENTITY', msg: 'The current password you provided is wrong.', toast: true },
  WRONG_OLD_PASSWORD: { code: 422, default: 'UNPROCESSABLE_ENTITY', msg: 'The current password you provided is wrong.', toast: true },
  
  INTERNAL_SERVER_ERROR: { code: 500, default: 'INTERNAL_SERVER_ERROR', msg: 'Internal server error. Try again in a few minutes.' },
  AWS_ERROR: { code: 500, default: 'INTERNAL_SERVER_ERROR', msg: 'Error uploading image to S3.' },

};