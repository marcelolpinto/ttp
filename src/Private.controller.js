import { BaseController } from './helpers';
import { User, Users } from './entities';
import { PropertiesRepository, UsersRepository } from './repositories';

export class PrivateController extends BaseController {
  constructor({ getState, getProps, toState }) {
    super({ getState, getProps, toState });

    this.usersRepo = new UsersRepository();
    this.propertiesRepo = new PropertiesRepository();

    this.init = this.init.bind(this);
    this.logout = this.logout.bind(this);
    this._handleAdminLogin = this._handleAdminLogin.bind(this);
  }

  async init() {
    const {
      showLoadingAction,
      closeLoadingAction,
      setSelfAction
    } = this.getProps();

    const user_id = window.localStorage.getItem('user_id');
    const token = window.localStorage.getItem('token');

    showLoadingAction();
    const user = await this.usersRepo.validate(user_id, token);
    closeLoadingAction();

    if(user.err) return this.logout();
    
    const self = new User(user.data.user);
    setSelfAction(self);
    
    if(self.role === 'admin') {
      this._handleAdminLogin(self);
    }    
  }

  
  
  async _handleAdminLogin(self) {
    const { setUsersAction } = this.getProps();
    const users = await this.usersRepo.list();
    
    if(!users.err) {
      const newUsers = new Users(users.data);
      setUsersAction(newUsers);
    } else {
      throw new Error('Error fetching users.');
    }
  }

  

  logout() {
    this.getProps().clearAction();
    window.localStorage.removeItem('user_id');
    window.localStorage.removeItem('token');
    return this.getProps().history.push('/');
  }
}