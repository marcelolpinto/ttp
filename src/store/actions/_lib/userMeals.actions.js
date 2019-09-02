export const SET_USER_MEALS = 'SET_USER_MEALS';
export const SELECT_USER_MEAL = 'SELECT_USER_MEAL';

export const setUserMealsAction = data => ({
  type: SET_USER_MEALS,
  data
});

export const selectUserMealAction = data => ({
  type: SELECT_USER_MEAL,
  data
});