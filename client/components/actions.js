import {createHash} from './scripts/crypto.js';

export const initial_meals = (hidden) => ({
  type: 'INITIAL_MEALS',
  status: hidden ? 'hidden' : 'initialized',
  api: {
    url: '/api/meals',
    method: 'get'
  },
  enqueue: initial_signups.bind(null, hidden)
});

export const initial_user = (id) => ({
  type: 'INITIAL_USER',
  api: {
    url: '/api/user/' + id,
    method: 'get'
  }
});

export const initial_signups = (hidden) => ({
  type: 'INITIAL_SIGNUPS',
  status: hidden ? 'hidden' : 'initialized',
  api: {
    url: '/api/signups',
    method: 'get'
  }
});

// service worker

export const connect_serviceworker = (data) => ({
  type: 'CONNECT_SERVICEWORKER',
  status: 'initialized',
  api: {
    url: '/api/notification',
    method: 'post',
    body: {
      type: 'gcm',
      subscription: data
    }
  }
});

export const convert_postmessage = (evt) => ({
  type: 'POSTMESSAGE',
  message: evt.data.message,
  payload: evt.data.payload
});

// general dialog

export const close_dialog = id => ({
  type: 'DIALOG',
  content: ''
});

export const set_busy  = state => ({
  type: 'BUSY',
  state
});

export const set_hidden_busy  = state => ({
  type: 'HIDDEN_BUSY',
  state
});

// transactions

export const show_transaction_history = (id) => ({
  type: 'DIALOG',
  content: 'OPEN_TRANSACTIONS',
  status: 'initialized',
  api: {
    url: `/api/user/${id}/history`,
    method: 'get'
  }
});

export const start_send_money = (id) => ({
  type: 'DIALOG',
  content: 'SEND_MONEY'
});

export const send_money = (data) => ({
  type: 'SEND_MONEY',
  status: 'initialized',
  ...data,
  api: {
    url: `/api/user/${data.target}/money`,
    method: 'put',
    body: data
  }
});


// impressum

export const show_impressum = () => ({
  type: 'DIALOG',
  content: 'OPEN_IMPRESSUM'
});

// error

export const create_error = (id, msg) => ({
  type: 'SHOW_ERROR',
  content: msg,
  id: id
});

export const delete_error = (id) => ({
  type: 'DELETE_ERROR',
  id: id
});

// signups

export const toggle_paid = (id, state) => ({
  type: 'SIGNUP_PAID',
  status: 'initialized',
  state,
  id,
  api: {
    url: `/api/signups/${id}/paid`,
    method: state ? 'post' : 'delete',
    body: {}
  }
});

export const start_meal_signup = id => ({
  type: 'DIALOG',
  content: 'MEAL_SIGNUP',
  option: {meal: id}
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
      userId: data.userId,
      options: data.options,
      meal: data.meal
    }
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
      options: data.options,
      comment: data.comment,
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


// meals
export const create_meal_dialog = () => ({
  type: 'DIALOG',
  content: 'CREATE_MEAL'
});

export const create_meal = (data) => ({
  type: 'CREATE_MEAL',
  status: 'initialized',
  api: {
    url: '/api/meals',
    method: 'post',
    headers: 'formdata',
    body: data
  }
});

export const submit_prices = (prices, mealId) => ({
  type: 'SUBMIT_PRICES',
  status: 'initialized',
  prices,
  mealId,
  api: {
    url: '/api/meals/prices',
    method: 'post',
    body: {prices}
  }
});

export const start_payment = (prices, mealId) => ({
  type: 'FINALIZE_PRICES',
  status: 'initialized',
  prices,
  mealId,
  api: {
    url: `/api/meals/${mealId}/lock`,
    method: 'post',
    body: {prices}
  }
});

export const start_edit_meal = (id) => ({
  type: 'DIALOG',
  content: 'EDIT_MEAL',
  option: {meal: id}
});

export const start_edit_price = (id) => ({
  type: 'DIALOG',
  content: 'EDIT_PRICE',
  option: {meal: id}
});

export const edit_meal = (id, data) => ({
  type: 'EDIT_MEAL',
  status: 'initialized',
  api: {
    url: '/api/meals/' + id,
    method: 'put',
    headers: 'formdata',
    body: data
  }
});

export const meal_new_image = (data) => ({
  type: 'CHECK_MAIL',
  status: 'initialized',
  api: {
    url: '/api/meals/' + encodeURL(data.id) + '/image',
    method: 'post',
    body: data.image
  }
});

export const start_cancel_meal = (id) => ({
  type: 'DIALOG',
  content: 'CANCEL_MEAL',
  option: {meal: id}
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


// settings dialog

export const create_settings_dialog = () => ({
  type: 'DIALOG',
  content: 'OPEN_SETTINGS'
});

export const save_settings = (data) => ({
  type: 'SAVE_SETTINGS',
  status: 'initialized',
  api: {
    url: '/api/user' + ((data.id !== undefined) ? ('/' + data.id) : ''),
    method: ((data.id !== undefined) ? 'put' : 'post'),
    body: {
      id: data.id,
      mail: data.mail,
      name: data.name,
      creationNotice: data.creationNotice_mail,
      deadlineReminder: data.deadlineReminder_mail
    }
  },
  enqueue: data => save_settings_locally(Object.assign({}, {
      creationNotice_notification: data.creationNotice_notification,
      deadlineReminder_notification: data.deadlineReminder_notification
    }, data))
});

export const save_settings_locally = (data) => ({
  type: 'SAVE_SETTINGS',
  status: 'complete',
  localkey: 'user',
  locally: data
});

export const check_mail = (mail) => ({
  type: 'CHECK_MAIL',
  status: 'hidden',
  api: {
    url: '/api/mail/search?email=' + encodeURIComponent(mail),
    method: 'GET'
  }
});

export const sign_out = () => ({
  type: 'SIGNOUT',
  status: 'complete',
  localkey: 'user',
  locally: {}
});

