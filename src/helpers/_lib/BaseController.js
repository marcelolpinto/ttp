import { Formatter } from "..";

export default class BaseController {
	constructor({ toState, getState, getProps }) {
		this.toState = toState;
		this.getState = getState;
		this.getProps = getProps;
  }
  
  baseHandleChange({ target: { value, id } }, format) {
    if(format) value = Formatter[format](value);
    return { [id]: value };
  }
}
