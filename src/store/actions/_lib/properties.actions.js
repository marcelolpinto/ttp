export const SET_PROPERTIES = 'SET_PROPERTIES';
export const SELECT_PROPERTY = 'SELECT_PROPERTY';

export const setPropertiesAction = data => ({
  type: SET_PROPERTIES,
  data
});

export const selectPropertyAction = data => ({
  type: SELECT_PROPERTY,
  data
});