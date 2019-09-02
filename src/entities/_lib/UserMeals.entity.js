import cloneDeep from 'lodash.clonedeep';

export class UserMeals {
  /**
   *Creates an instance of UserMeals.
   * @param {Array} userMeals - array of { id: {String}, meals: {Meals} }
   * @memberof UserMeals
   */
  constructor(userMeals) {
    this.original = userMeals;

    this.all = userMeals.map(m => ({ id: m.id, meals: m.meals }));
  }

  add(newUserMeal) {
    const copy = cloneDeep(this.original);
    copy.push({ id: newUserMeal.id, meals: newUserMeal.meals });

    return new UserMeals(copy);
  }

  addMeal(userId, meal) {
    const copy = cloneDeep(this.original);
    let index = -1, meals = null;
    for(let i in copy) {
      if(copy[i].id === userId) {
        index = i; 
        meals = copy[i].meals
      }
    }
    if(index > -1) {
      meals = meals.add(meal);
      copy.splice(index, 1, { id: userId, meals });
    }
    return new UserMeals(copy);
  }

  updateMeal(userId, mealId, meal) {
    const copy = cloneDeep(this.original);
    let index = -1, meals = null;
    for(let i in copy) {
      if(copy[i].id === userId) {
        index = i; 
        meals = copy[i].meals;
      }
    }
    if(index > -1) {
      meals = meals.update(mealId, meal);
      copy.splice(index, 1, { id: userId, meals });
    }
    return new UserMeals(copy);
  }

  removeMeal(userId, mealId) {
    const copy = cloneDeep(this.original);
    let index = -1, meals = null;
    for(let i in copy) {
      if(copy[i].id === userId) {
        index = i; 
        meals = copy[i].meals;
      }
    }
    if(index > -1) {
      meals = meals.remove(mealId);
      copy.splice(index, 1, { id: userId, meals });
    }
    return new UserMeals(copy);
  }

  getById(id) {
    return this.all.find(m => m.id === id);
  }
}