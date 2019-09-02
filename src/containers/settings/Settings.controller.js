import { BaseController, Validator } from '../../helpers';
import { UsersRepository } from '../../repositories';
import { toast } from 'react-toastify';
import { User } from '../../entities';

export class SettingsController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.usersRepo = new UsersRepository();
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  async handleSubmit(e) {
    e.preventDefault();
    let { name, email, max_calories } = this.getState();
    const values = { name, email, max_calories };
    const {
      self,
      users,
      history,
      setSelfAction,
      setUsersAction,
      showLoadingAction,
      closeLoadingAction
    } = this.getProps();

    const { errors, validated } = Validator.editSelf(values, self.role);
    if(!validated) return this.toState({ errors });

    showLoadingAction();
    const newUser = await this.usersRepo.update(self.id, values);
    closeLoadingAction();

    if(!newUser.err) {
      const newSelf = new User({ ...self.original, ...values });
      setSelfAction(newSelf);

      if(self.role !== 'user') {
        const newUsers = users.update(self.id, values);
        setUsersAction(newUsers);
      }

      const url = {
        user: `/dashboard/${self.id}`,
        manager: '/users',
        admin: '/users'
      }[self.role] || '/dashboard';
      toast('Update successful');
      history.push(url);
    } else {
      console.log(newUser.err);
      throw new Error('Error creating user');
    }
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const { self, showLoadingAction, history, closeLoadingAction } = this.getProps();
    const {   old_password, password, confirm_password } = this.getState();
    const values = { old_password, password, confirm_password };

    const { validated, errors } = Validator.changePassword(values)
    if(!validated) return this.toState({ errors });
    
    delete values.confirm_password;
    showLoadingAction();
    const userPromise = await this.usersRepo.changePassword(self.id, values);
    closeLoadingAction();
    if(userPromise.err) toast(userPromise.err.msg);
    else {
      toast('Password updated successfully.');

      const url = {
        user: `/dashboard/${self.id}`,
        manager: '/users',
        admin: '/users'
      }[self.role] || '/dashboard';
  
      history.push(url);
    }
  }
}