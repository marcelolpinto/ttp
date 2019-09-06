import { BaseEntity } from "../../helpers";
import { Property } from "..";

export class Properties extends BaseEntity {
  constructor(properties) {
    super();
    
    this.original = properties;

    this.all = properties.map(property => new Property(property));
  }

  add(newProperty) {
    return this.baseAdd(newProperty, this.original, Properties, 'date');
  }

  update(id, update) {
    return this.baseUpdate(id, this.original, Properties, update, '_id', 'date');
  }

  remove(id) {
    return this.baseRemove(id, this.original, Properties);
  }

  getById(id) {
    return this.baseGetById(id, this.all);
  }
}