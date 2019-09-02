import { combineReducers } from 'redux';

import { loadingReducer } from "./_lib/loading.reducer"
import { mealsReducer } from "./_lib/meals.reducer"
import { modalReducer } from "./_lib/modal.reducer"
import { userMealsReducer } from "./_lib/userMeals.reducer"
import { usersReducer } from "./_lib/users.reducer"

const rootReducer = combineReducers({
  loading: loadingReducer,
  meals: mealsReducer,
  modal: modalReducer,
  userMeals: userMealsReducer,
  users: usersReducer
});

export default rootReducer;