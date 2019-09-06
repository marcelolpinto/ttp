import { BaseRepository } from './Base.repository';

export class PropertiesRepository extends BaseRepository {

  list(userId) {
    return this.get(`/users/${userId}/properties`);
  }

  fetch(userId, propertyId) {
    return this.get(`/users/${userId}/properties/${propertyId}`);    
  }

  create(userId, body) {
    return this.post(`/users/${userId}/properties`, body);
  }

  update(userId, propertyId, body) {
    return this.put(`/users/${userId}/properties/${propertyId}`, body);
  }

  remove(userId, propertyId) {
    return this.delete(`/users/${userId}/properties/${propertyId}`);
  }
}