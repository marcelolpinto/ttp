import { BaseEntity } from "../../helpers";
import { Meal } from "..";

export class Meals extends BaseEntity {
  constructor(meals) {
    super();
    
    this.original = meals;

    this.all = meals.map(meal => new Meal(meal));
    this.caloriesByDay = this._generateCaloriesByDay(this.all);
  }

  add(newMeal) {
    return this.baseAdd(newMeal, this.original, Meals, 'date');
  }

  update(id, update) {
    return this.baseUpdate(id, this.original, Meals, update, '_id', 'date');
  }

  remove(id) {
    return this.baseRemove(id, this.original, Meals);
  }

  getById(id) {
    return this.baseGetById(id, this.all);
  }

  _generateCaloriesByDay(all) {
    const grouped = {};

    all.forEach(meal => {
      if(!grouped[meal.day]) grouped[meal.day] = 0;
      grouped[meal.day] += meal.calories;
    })

    return grouped;
  }
}