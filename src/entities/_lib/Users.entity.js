import { BaseEntity } from "../../helpers";
import { User } from "..";

export class Users extends BaseEntity {
  constructor(users) {
    super();
    
    this.original = users;

    this.all = users.map(user => new User(user));
    this.allUsers = this.all.filter(u => u.role === 'user');
  }

  add(item) {
    return this.baseAdd(item, this.original, Users);
  }

  update(id, update) {
    return this.baseUpdate(id, this.original, Users, update);
  }

  remove(id) {
    return this.baseRemove(id, this.original, Users);
  }

  getById(id) {
    return this.baseGetById(id, this.all);
  }
}