import {
  CLEAR_HEADER_IMAGE,
  RESTORE_HEADER_IMAGE
} from "../../actions";

const initialState = {
  show: true
};

export const headerReducer = (state = initialState, action) => {
	switch(action.type) {
    case CLEAR_HEADER_IMAGE:
      return { ...state, show: false };
    case RESTORE_HEADER_IMAGE:
      return { ...state, show: true };
      
		default:
			return state;
	}
};

