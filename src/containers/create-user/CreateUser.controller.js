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
    const { name, email, password, confirm_password } = this.getState();
    const values = { name, email, password, confirm_password, origin: 'form' };
    
    values.role = 'client';
    const { validated, errors } = Validator.createUser(values);
    if(!validated) return this.toState({ errors });

    delete values.confirm_password;

    showLoadingAction();
    const user = await this.usersRepo.create(values);
    closeLoadingAction();

    if(!user.err) {
      toast(`User created successfully. You have to verify your account in your email to login.`);
      history.push('/');
    }
  }
}