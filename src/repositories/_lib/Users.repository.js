import { BaseRepository } from './Base.repository';

export class UsersRepository extends BaseRepository {
  changePassword(userId, body) {
    return this.post(`/users/${userId}/change-password`, body);
  }

  authenticate(body) {
    return this.post('/authenticate', body);
  }

  authenticateSocialMedia(body) {
    return this.post('/authenticate-sm', body);
  }

  validate(user_id, token) {
    token = token || window.localStorage.getItem('token');
    return this.get(`/validate-user?user_id=${user_id}&token=${token}`);
  }

  list() {
    const token = window.localStorage.getItem('token');
    return this.get(`/users?token=${token}`);
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

  update(userId, body, token) {
    token = token || window.localStorage.getItem('token');
    return this.put(`/users/${userId}?token=${token}`, body);
  }

  uploadImage(userId, body) {
    const token = window.localStorage.getItem('token');    
    return this.put(`/users/${userId}/upload-image?token=${token}`, body);
  }

  remove(userId) {
    const token = window.localStorage.getItem('token');    
    return this.delete(`/users/${userId}?token=${token}`);
  }

  sendInvitation(body) {
    const token = window.localStorage.getItem('token');    
    return this.post(`/invite-user?token=${token}`, body)
  }
}