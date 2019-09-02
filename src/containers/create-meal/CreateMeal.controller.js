import { BaseController, Validator } from '../../helpers';
import { MealsRepository } from '../../repositories';

export class CreateMealController extends BaseController  {
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
    let { name, calories, date } = this.getState();
    const {
      self,
      meals,
      history,
      setMealsAction,
      showLoadingAction,
      closeLoadingAction,
      setUserMealsAction,
      selectedUser,
      userMeals
    } = this.getProps();
    calories = parseInt(calories);

    const { errors, validated } = Validator.meal({ name, calories, date });
    if(!validated) return this.toState({ errors });

    const id = selectedUser ? selectedUser.id : self.id;

    showLoadingAction();
    const newMeal = await this.mealsRepo.create(id, { name, calories, date });
    closeLoadingAction();

    if(!newMeal.err) {
      if(selectedUser) {
        const newUserMeals = userMeals.addMeal(id, newMeal.data);
        setUserMealsAction(newUserMeals);
      }

      const newMeals = meals.add(newMeal.data);
      setMealsAction(newMeals);
      history.push(`/dashboard/${id}`);
    } else {
      console.log(newMeal.err);
      throw new Error('Error creating meal');
    }
  }
}