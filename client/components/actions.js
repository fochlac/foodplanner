import {createHash} from './scripts/crypto.js';

export const initial_meals = () => ({
  type: 'INITIAL_MEALS',
  status: 'initialized',
  api: {
    url: '/api/meals',
    method: 'get'
  },
  enqueue: initial_signups()
});

export const initial_signups = () => ({
  type: 'INITIAL_SIGNUPS',
  status: 'initialized',
  api: {
    url: '/api/signups',
    method: 'get'
  }
});

export const start_meal_signup = id => ({
  type: 'DIALOG',
  content: 'MEAL_SIGNUP',
  option: {meal: id}
});

export const close_dialog = id => ({
  type: 'DIALOG',
  content: ''
});

export const meal_signup = (data) => ({
  type: 'MEAL_SIGNUP',
  status: 'initialized',
  api: {
    url: '/api/signups',
    method: 'post',
    body: {
      name: data.name,
      comment: data.comment,
      user: data.user,
      meal: data.meal
    }
  }
});

export const meal_cancel = id => ({
  type: 'MEAL_CANCEL',
  status: 'initialized',
  id: id,
  api: {
    url: '/api/signups/' + id,
    method: 'delete'
  }
});

export const start_meal_edit = id => ({
  type: 'DIALOG',
  content: 'MEAL_EDIT',
  option: {signup: id}
});

export const meal_edit = (data) => ({
  type: 'MEAL_EDIT',
  status: 'initialized',
  api: {
    url: '/api/signups/' + data.signup,
    method: 'put',
    body: {
      name: data.name,
      comment: data.comment
    }
  }
});

export const create_settings_dialog = () => ({
  type: 'LOGOUT',
  status: 'initialized',
  api: {
    url: '/api/login',
    method: 'delete'
  }
});

export const create_meal_dialog = () => ({
  type: 'DIALOG',
  content: 'CREATE_MEAL'
});

export const start_edit_meal = (id) => ({
  type: 'DIALOG',
  content: 'EDIT_MEAL',
  option: {meal: id}
});

export const create_meal = (data) => ({
  type: 'CREATE_MEAL',
  status: 'initialized',
  api: {
    url: '/api/meals',
    method: 'post',
    body: data
  }
});

export const edit_meal = (data) => ({
  type: 'EDIT_MEAL',
  status: 'initialized',
  api: {
    url: '/api/meals/' + data.id,
    method: 'put',
    body: data
  }
});

export const cancel_meal = (id) => ({
  type: 'CANCEL_MEAL',
  status: 'initialized',
  id: id,
  api: {
    url: '/api/meals/' + id,
    method: 'delete'
  }
});
