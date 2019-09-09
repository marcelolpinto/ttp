import Validator from "../../helpers/_lib/Validator";
import { BaseController } from "../../helpers";
import { UsersRepository } from "../../repositories";
import { toast } from 'react-toastify';

export class CompleteUserController extends BaseController {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();

    this.initialValidation = this.initialValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async initialValidation() {
    const { history } = this.getProps();
    const { query } = this.getState();
    const { user_id, token } = query;

    const validation = await this.usersRepo.validate(user_id, token);
    if(validation.err) return history.push('/');

    const { user } = validation.data;
    
    if(user.status !== 'invited') {
      console.error("User didn't receive invitation.");
      return history.push('/');
    }
  }

  handleChange(e, format) {
    const state = this.getState();

    return this.toState({
      ...state,
      ...this.baseHandleChange(e, format),
      errors: {
        ...state.errors,
        [e.target.id]: ''
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { showLoadingAction, history, closeLoadingAction } = this.getProps();
    const { name, email, password, confirm_password, query: { user_id, token } } = this.getState();
    const values = { name, email, password, confirm_password };
    
    const { validated, errors } = Validator.createUser(values);
    if(!validated) return this.toState({ errors });

    delete values.confirm_password;
    values.status = 'active';

    showLoadingAction();
    const user = await this.usersRepo.update(user_id, values);
    closeLoadingAction();

    if(!user.err) {
      window.localStorage.setItem('user_id', user_id);
      window.localStorage.setItem('token', token);

      toast(`Welcome to TTP Properties.`);

      const url = {
        admin: '/users'
      }[user.data.role] || '/properties';

      history.push(url);
    }
  }
}