import Validator from "../../helpers/_lib/Validator";
import { BaseController } from "../../helpers";
import { UsersRepository } from "../../repositories";
import { toast } from "react-toastify";

export class CreateUserController extends BaseController {
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
    const { showLoadingAction, history, closeLoadingAction } = this.getProps();
    const { name, email, max_calories, password, confirm_password } = this.getState();
    const values = { name, email, max_calories, password, confirm_password };
    
    values.role = 'user';
    const { validated, errors } = Validator.createUser(values);
    if(!validated) return this.toState({ errors });

    showLoadingAction();
    const user = await this.usersRepo.create(values);
    closeLoadingAction();

    if(user.err) {
      if(user.err.msg.startsWith('E11000')) toast('This e-mail is already taken.');
      else toast(user.err.msg);
    }
    else {
      toast(`User created successfully. You can now login with ${email}`);
      history.push('/');
    }
  }
}