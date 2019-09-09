import { Formatter } from '../../helpers';

export class Property {
  constructor(property) {
    this.original = property;

    this.id = property._id;
    this.realtorId = property.realtorId;
    this.name = property.name;
    this.description = property.description;
    this.coords = property.coords;
    this.isRented = property.isRented;
    this.price = property.price;
    this.priceString = 'U$ '  + Formatter.money(property.price);
    this.bedrooms = property.bedrooms;
    this.address = property.address;
    this.placeId = property.placeId;
    this.area = property.area;
    this.areaString = property.area.toString() + ' sqm';
  }
}