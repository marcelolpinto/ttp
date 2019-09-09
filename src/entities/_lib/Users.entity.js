import { BaseEntity } from "../../helpers";
import { User } from "..";

export class Users extends BaseEntity {
  constructor(users) {
    super();
    
    this.original = users;

    this.all = users.map(user => new User(user));

    this.realtorsToSelect = this.all.filter(r => r.role !== 'client' && r.status === 'active').map(r => ({
      value: r.id,
      label: r.name
    }))
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