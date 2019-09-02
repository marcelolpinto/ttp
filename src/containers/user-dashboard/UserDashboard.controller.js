import sortBy from 'lodash.sortby';
import moment from 'moment';

import { BaseController } from "../../helpers";
import { MealsRepository } from '../../repositories';
import { Meals, UserMeals } from '../../entities';

export const defaultFilters = {
  dateFrom: null,
  dateTo: null,
  timeFrom: null,
  timeTo: null
};

export class UserDashboardController extends BaseController {
  constructor({ toState, getState, getProps }) {
    super({ toState, getState, getProps });

    this.mealsRepo = new MealsRepository();

    this.adminFetchAndSetMeals = this.adminFetchAndSetMeals.bind(this);
    this.handleToTable = this.handleToTable.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleDeleteMeal = this.handleDeleteMeal.bind(this);
    this.handleClearFilters = this.handleClearFilters.bind(this);
  }

  async adminFetchAndSetMeals(id) {
    const {
      userMeals,
      setUserMealsAction,
      setMealsAction,
      showLoadingAction,
      closeLoadingAction
    } = this.getProps();

    await this.toState({ fetching: true });

    showLoadingAction();
    const meals = await this.mealsRepo.list(id);
    closeLoadingAction();

    if(!meals.err) {
      const newMeals = new Meals(meals.data);
      const newUserMeals = userMeals ? userMeals.add({ id, meals: newMeals }) : new UserMeals([{ id, meals: newMeals }]);
      setUserMealsAction(newUserMeals);
      setMealsAction(newMeals);

    } else {
      console.log(meals.err);
      throw new Error('Error fetching meals.');
    }
  }

  handleToTable(all, options = { filters: defaultFilters }) {
    if(!all) return;
    const { dateFrom, dateTo, timeFrom, timeTo } = options.filters;
    
    if(dateFrom || dateTo || timeFrom || timeTo) {
      all = all.filter(meal => {
        if(dateFrom && !timeFrom && moment(dateFrom).isSameOrAfter(meal.lastMinuteDate)) return false;
        if(dateFrom && timeFrom && moment(dateFrom).isSameOrAfter(meal.originalDate)) return false;

        if(dateTo && !timeTo && moment(dateTo).isSameOrBefore(meal.firstMinuteDate)) return false;
        if(dateTo && timeTo && moment(dateTo).isSameOrBefore(meal.originalDate)) return false;

        
        if(timeFrom && this._getMinutesCount(timeFrom) > meal.minutesCount) return false;
        if(timeTo && this._getMinutesCount(timeTo) < meal.minutesCount) return false;
        
        return true;
      });
    }

    return all;
  }

  handleChangeFilter(value, id) {
    const { filters } = this.getState();
    const { meals } = this.getProps();

    filters[id] = value;
    const toTable = this.handleToTable(meals.all, { filters });

    this.toState({ filters, toTable });
  }
  
  handleSort(id) {
    let { sort } = this.getState();
    const { meals } = this.getProps();

    if(id.startsWith('-')) id = id.slice(1);

    let all = sortBy(meals.all, id);
    if(sort === id) {
      sort = '-' + id;
      all = all.reverse();
    } else {
      sort = id;
    }
        
    const { filters } = this.getState();
    const toTable = this.handleToTable(all, { filters });
  
    this.toState({ sort, toTable });
  }

  async handleDeleteMeal(mealId) {
    const {
      meals,
      setMealsAction,
      closeModalAction,
      showLoadingAction,
      closeLoadingAction,
      userMeals,
      setUserMealsAction,
      selectedUser,
      self
    } = this.getProps();

    const id = selectedUser ? selectedUser.id : self.id;

    closeModalAction();
    showLoadingAction();
    const result = await this.mealsRepo.remove(id, mealId);
    closeLoadingAction();
    
    if(!result.err) {
      if(selectedUser) {
        const newUserMeals = userMeals.removeMeal(id, mealId);
        setUserMealsAction(newUserMeals);
      }

      const { filters } = this.getState();
      const newMeals = meals.remove(mealId);

      setMealsAction(newMeals);
      
      const toTable = this.handleToTable(newMeals.all, { filters });
      this.toState({ toTable })
    } else {
      console.log(result.err);
      throw new Error('Error deleting meal. Error message above.');
    }
  }

  _getMinutesCount(timeString) {
    const date = new Date(timeString);
    return date.getMinutes() + 60 * date.getHours();
  }

  handleClearFilters() {
    const { meals } = this.getProps();
    const filters = {
      dateFrom: null,
      dateTo: null,
      timeFrom: null,
      timeTo: null
    };

    const toTable = this.handleToTable(meals.all, { filters });
    this.toState({ filters, toTable });
  }
}