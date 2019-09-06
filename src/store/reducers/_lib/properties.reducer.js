import { SET_PROPERTIES, SELECT_PROPERTY, CLEAR } from '../../actions';

const INITIAL_STATE = {
  model: null,
  current: null
}

export const propertiesReducer = (state = INITIAL_STATE, action) => {
  const { type, data } = action;

  switch(type) {
    case SET_PROPERTIES: return { ...state, model: data }
    case SELECT_PROPERTY: return { ...state, current: data }
    case CLEAR: return INITIAL_STATE;
    default: return state;
  }
}