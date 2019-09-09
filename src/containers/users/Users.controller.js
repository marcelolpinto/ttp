import sortBy from 'lodash.sortby';

import { BaseController } from "../../helpers";
import { UsersRepository } from '../../repositories';

export class UsersController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });

    this.usersRepo = new UsersRepository();

    this.handleSort = this.handleSort.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleViewUser = this.handleViewUser.bind(this);
  }

  handleViewUser(e, id) {
    e.stopPropagation();
    const { history, selectUserAction, users } = this.getProps();

    const user = users.getById(id);

    selectUserAction(user);

    history.push(`/dashboard/${id}`);
  }

  handleSort(id) {
    let { sort } = this.getState();
    const { users } = this.getProps();
    const selection = users.all;

    if(id.startsWith('-')) id = id.slice(1);

    let all = sortBy(selection, id);
    if(sort === id) {
      sort = '-' + id;
      all = all.reverse();
    } else {
      sort = id;
    }

    this.toState({ sort, toTable: all });
  }

  async handleDeleteUser(id) {
    const {
      self,
      users,
      history,
      setUsersAction,
      closeModalAction,
      showLoadingAction,
      closeLoadingAction,
    } = this.getProps();

    const token = window.localStorage.getItem('token');

    closeModalAction();
    showLoadingAction();
    const result = await this.usersRepo.remove(id, token);
    closeLoadingAction();
    
    if(!result.err) {
      if(id === self.id) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user_id');
        return history.push('/');
      }

      const newUsers = users.remove(id);
      setUsersAction(newUsers);

      const toTable = newUsers.all;
      this.toState({ toTable })
    }
  }
}