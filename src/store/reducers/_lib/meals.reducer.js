import { SET_MEALS, SELECT_MEAL, CLEAR } from '../../actions';

const INITIAL_STATE = {
  model: null,
  current: null
}

export const mealsReducer = (state = INITIAL_STATE, action) => {
  const { type, data } = action;

  switch(type) {
    case SET_MEALS: return { ...state, model: data }
    case SELECT_MEAL: return { ...state, current: data }
    case CLEAR: return INITIAL_STATE;
    default: return state;
  }
}