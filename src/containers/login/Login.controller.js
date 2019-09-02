import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';

export class LoginController extends BaseController {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { history } = this.getProps();
    const { email, password } = this.getState();

    const { errors, validated } = Validator.login({ email, password });
    if(!validated) return this.toState({ errors });

    const auth = await this.usersRepo.authenticate({ email, password });
    if(auth.err) return toast(auth.err.msg);

    const { user: { _id, role }, token } = auth.data;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user_id', _id);

    const url = {
      user: `/dashboard/${_id}`,
      manager: '/users',
      admin: '/users'
    }[role] || '/dashboard';

    history.push(url);
  }
}