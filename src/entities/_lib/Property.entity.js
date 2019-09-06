import moment from 'moment';

export class Property {
  constructor(property) {
    this.original = property;

    this.id = property._id;
    this.realtorId = property.realtor_id;
    this.name = property.name;
  }
}