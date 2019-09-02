import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';

export class EditUserController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
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
  
  handleSelect(e) {
    const { errors } = this.getState();
    const { value, name } = e.target;
    this.toState({ [name]: value, errors: { ...errors, [name]: '' } });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { showLoadingAction, history, closeLoadingAction, users, setUsersAction } = this.getProps();
    const { user, name, email, max_calories, role } = this.getState();
    const values = { name, email, max_calories, role };

    if(!this._hasChanged(user, values)) return toast("No modifications were made.");

    const { validated, errors } = Validator.editUser(values)
    if(!validated) return this.toState({ errors });
    
    showLoadingAction();
    const userPromise = await this.usersRepo.update(user.id, values);
    closeLoadingAction();

    if(userPromise.err) {
      if(userPromise.err.msg.startsWith('E11000')) toast('This e-mail is already taken.');
      else toast(userPromise.err.msg);
    }
    else {
      const newUsers = users.update(user.id, values);
      setUsersAction(newUsers);
      toast(`User updated successfully.`);
      history.push('/users');
    }
  }

  _hasChanged(user, values) {
    let res = false;
    ['name', 'email', 'max_calories', 'role'].forEach(key => {
      if(user[key] !== values[key]) res = true;
    })
    return res;
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const { showLoadingAction, history, closeLoadingAction } = this.getProps();
    const { user, password, confirm_password } = this.getState();
    const values = { password, confirm_password };

    const { validated, errors } = Validator.editUserPassword(values)
    if(!validated) return this.toState({ errors });
    
    showLoadingAction();
    const userPromise = await this.usersRepo.update(user.id, values);
    closeLoadingAction();
    if(userPromise.err) toast(userPromise.err);
    else {
      toast(`User's password updated successfully.`);
      history.push('/users');
    }
  }
}