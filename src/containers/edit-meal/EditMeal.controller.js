import { toast } from 'react-toastify';

import { BaseController, Validator } from '../../helpers';
import { MealsRepository } from '../../repositories';

export class EditMealController extends BaseController  {
  constructor({ toState, getProps, getState }) {
    super({ toState, getProps, getState });

    this.mealsRepo = new MealsRepository();
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, format) {
    const state = this.getState();
    return this.toState({
      ...state,
      ...this.baseHandleChange(e, format),
      errors: {
        ...state.errors,
        [e.target.id]: ''
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let { name, calories, date, meal } = this.getState();
    const {
      meals,
      history,
      setMealsAction,
      self,
      selectedUser,
      showLoadingAction,
      closeLoadingAction,
      userMeals,
      setUserMealsAction
    } = this.getProps();
    calories = parseInt(calories);
    const values = { name, calories, date };

    if(!this._hasChanged(meal, values)) return toast("No modifications were made.");

    const { validated, errors } = Validator.meal(values);
    if(!validated) return this.toState({ errors });

    const id = selectedUser ? selectedUser.id : self.id;    

    showLoadingAction();
    const newMeal = await this.mealsRepo.update(id, meal.id, values);
    closeLoadingAction();

    if(!newMeal.err) {
      if(selectedUser) {
        const newUserMeals = userMeals.updateMeal(id, meal.id, values);
        setUserMealsAction(newUserMeals);
      }

      const newMeals = meals.update(meal.id, values);
      setMealsAction(newMeals);
      history.push(`/dashboard/${id}`);
    } else {
      toast(newMeal.err.msg);
    }
  }

  _hasChanged(meal, values) {
    let res = false;
    ['name', 'calories', 'date'].forEach(key => {
      if(meal[key] !== values[key]) res = true;
    })
    return res;
  }
}