import { BaseController } from './helpers';
import { Properties, User, Users } from './entities';
import { PropertiesRepository, UsersRepository } from './repositories';

export class PrivateController extends BaseController {
  constructor({ getState, getProps, toState }) {
    super({ getState, getProps, toState });

    this.usersRepo = new UsersRepository();
    this.propertiesRepo = new PropertiesRepository();

    this.init = this.init.bind(this);
    this.logout = this.logout.bind(this);
    this.homeClick = this.homeClick.bind(this);
    this._handleUserLogin = this._handleUserLogin.bind(this);
    this._handleManagerAdminLogin = this._handleManagerAdminLogin.bind(this);
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
    
    const method = {
      user: () => this._handleUserLogin(self),
      manager: () => this._handleManagerAdminLogin(self),
      admin: () => this._handleAdminLogin(self)
    }[self.role];
    
    method();
  }

  async _handleUserLogin(self) {
    const { setPropertiesAction } = this.getProps();
    const properties = await this.propertiesRepo.list(self.id);
    
    if(!properties.err) {
      const newProperties = new Properties(properties.data);
      setPropertiesAction(newProperties);
    } else {
      console.log(properties.err);
      throw new Error('Error fetching properties.');
    }
  }

  async _handleManagerAdminLogin(self) {
    const { setUsersAction } = this.getProps();
    const users = await this.usersRepo.list();
    
    if(!users.err) {
      const newUsers = new Users(users.data);
      setUsersAction(newUsers);
    } else {
      console.log(users.err);
      throw new Error('Error fetching users.');
    }
  }

  async _handleAdminLogin(self) {
    const { setUsersAction } = this.getProps();
    const users = await this.usersRepo.list();
    
    if(!users.err) {
      const newUsers = new Users(users.data);
      setUsersAction(newUsers);
    } else {
      console.log(users.err);
      throw new Error('Error fetching users.');
    }
  }

  homeClick() {
    const { self, history } = this.getProps();
    
    const url = {
      user: `/dashboard/${self.id}`,
      manager: '/users',
      admin: '/users'
    }[self.role] || `/dashboard/${self.id}`;

    history.push(url);
  }

  logout() {
    this.getProps().clearAction();
    window.localStorage.removeItem('user_id');
    window.localStorage.removeItem('token');
    return this.getProps().history.push('/');
  }
}