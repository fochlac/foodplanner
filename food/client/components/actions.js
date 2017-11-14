import {createHash} from './scripts/crypto.js';

export const initial_signups = (data) => ({
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

export const logout = () => ({
  type: 'LOGOUT',
  status: 'initialized',
  api: {
    url: '/api/login',
    method: 'delete'
  }
});

export const login = data => ({
  type: 'LOGIN',
  status: 'initialized',
  api: {
    url: '/api/login',
    method: 'post',
    body: {login: data.name, password: data.pass}
  }
});

export const start_login = data => {
  return dispatch => {
    createHash(data.pass)
      .then((hash) => {
        dispatch(login({
          name: data.name,
          pass: hash
        }))
      }).catch(console.log);
  }
};




