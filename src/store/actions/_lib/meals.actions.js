export const SET_MEALS = 'SET_MEALS';
export const SELECT_MEAL = 'SELECT_MEAL';

export const setMealsAction = data => ({
  type: SET_MEALS,
  data
});

export const selectMealAction = data => ({
  type: SELECT_MEAL,
  data
});