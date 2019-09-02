import { BaseRepository } from './Base.repository';

export class MealsRepository extends BaseRepository {

  list(userId) {
    return this.get(`/users/${userId}/meals`);
  }

  fetch(userId, mealId) {
    return this.get(`/users/${userId}/meals/${mealId}`);    
  }

  create(userId, body) {
    return this.post(`/users/${userId}/meals`, body);
  }

  update(userId, mealId, body) {
    return this.put(`/users/${userId}/meals/${mealId}`, body);
  }

  remove(userId, mealId) {
    return this.delete(`/users/${userId}/meals/${mealId}`);
  }
}