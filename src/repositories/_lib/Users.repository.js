import { BaseRepository } from './Base.repository';

export class UsersRepository extends BaseRepository {
  changePassword(userId, body) {
    return this.post(`/users/${userId}/change-password`, body);
  }

  authenticate(body) {
    return this.post('/users/authenticate', body);
  }

  validate(user_id, token) {
    return this.get(`/users/validate?user_id=${user_id}&token=${token}`);
  }

  list() {
    return this.get(`/users`);
  }

  fetch(userId) {
    return this.get(`/users/${userId}`);    
  }

  fetchByEmail(userEmail) {
    return this.get(`/users/email?email=${userEmail}`);    
  }

  create(body) {
    return this.post(`/users`, body);
  }

  update(userId, body) {
    return this.put(`/users/${userId}`, body);
  }

  remove(userId) {
    return this.delete(`/users/${userId}`);
  }
}