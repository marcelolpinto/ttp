export const OPEN_MODAL = 'OPEN_MODAL'; 
export const CLOSE_MODAL = 'CLOSE_MODAL'; 

export const openModalAction = data => ({
  type: OPEN_MODAL,
  data
});

export const closeModalAction = () => ({
  type: CLOSE_MODAL,
});