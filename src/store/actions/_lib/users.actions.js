export const SET_SELF = 'SET_SELF';
export const SET_SELFS = 'SET_SELFS';
export const SELECT_USER = 'SELECT_USER';

export const setSelfAction = data => ({
  type: SET_SELF,
  data
});

export const setUsersAction = data => ({
  type: SET_SELFS,
  data
});

export const selectUserAction = data => ({
  type: SELECT_USER,
  data
});