import { SET_USER_MEALS, SELECT_USER_MEAL, CLEAR } from '../../actions';

const INITIAL_STATE = {
  model: null,
  current: null
}

export const userMealsReducer = (state = INITIAL_STATE, action) => {
  const { type, data } = action;

  switch(type) {
    case SET_USER_MEALS: return { ...state, model: data }
    case SELECT_USER_MEAL: return { ...state, current: data }
    case CLEAR: return INITIAL_STATE
    default: return state;
  }
}