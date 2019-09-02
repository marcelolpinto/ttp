import { 
  OPEN_MODAL,
  CLOSE_MODAL
} from "../../actions";

const INITIAL_STATE = {
  open: false,
  title: '',
  description: '',
  buttonLabel: ''
};

export const modalReducer = (state = INITIAL_STATE, action) => {
  const { type, data } = action;
	switch(type) {
    case OPEN_MODAL:
			return {
        ...state,
        ...data,
        open: true
      };
    case CLOSE_MODAL:
			return INITIAL_STATE;
      
		default:
			return state;
	}
};

