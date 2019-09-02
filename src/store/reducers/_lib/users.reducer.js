import { SET_SELF, SET_SELFS, SELECT_USER, CLEAR } from '../../actions';

const INITIAL_STATE = {
  self: null,
  model: null,
  current: null
}

export const usersReducer = (state = INITIAL_STATE, action) => {
  const { type, data } = action;

  switch(type) {
    case SET_SELF: return { ...state, self: data }
    case SET_SELFS: return { ...state, model: data }
    case SELECT_USER: return { ...state, current: data }
    case CLEAR: return INITIAL_STATE;
    default: return state;
  }
}