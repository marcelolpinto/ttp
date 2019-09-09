import { BaseRepository } from './Base.repository';

export class PropertiesRepository extends BaseRepository {

  list(query) {
    return this.get(`/properties?${query}`);
  }

  fetch(propertyId, token) {
    return this.get(`/properties/${propertyId}?token=${token}`);    
  }

  create(body, token) {
    return this.post(`/properties?token=${token}`, body);
  }

  update(propertyId, body, token) {
    return this.put(`/properties/${propertyId}?token=${token}`, body);
  }

  remove(propertyId, token) {
    return this.delete(`/properties/${propertyId}?token=${token}`);
  }
}