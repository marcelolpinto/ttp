import {
  SHOW_LOADING,
  CLOSE_LOADING
} from "../../actions";

const initialState = {
  show: false
};

export const loadingReducer = (state = initialState, action) => {
	switch(action.type) {
    case SHOW_LOADING:
      return { ...state, show: true };
    case CLOSE_LOADING:
      return { ...state, show: false };
      
		default:
			return state;
	}
};

