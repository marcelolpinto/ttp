import { combineReducers } from 'redux';

import { headerReducer } from "./_lib/header.reducer"
import { loadingReducer } from "./_lib/loading.reducer"
import { modalReducer } from "./_lib/modal.reducer"
import { propertiesReducer } from "./_lib/properties.reducer"
import { usersReducer } from "./_lib/users.reducer"

const rootReducer = combineReducers({
  header: headerReducer,
  loading: loadingReducer,
  modal: modalReducer,
  properties: propertiesReducer,
  users: usersReducer
});

export default rootReducer;