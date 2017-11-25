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

export const initial_user = (data) => ({
  type: 'INITIAL_USER',
  mail: data
});

export const initial_signups = () => ({
  type: 'INITIAL_SIGNUPS',
  status: 'initialized',
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

// signups

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
      user: data.user,
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
      comment: data.comment
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


// settings dialog

export const create_settings_dialog = () => ({
  type: 'DIALOG',
  content: 'OPEN_SETTINGS'
});

export const save_settings = (data) => ({
  type: 'SAVE_SETTINGS',
  status: 'initialized',
  api: {
    url: '/api/mail' + ((data.mailId !== undefined) ? ('/' + data.mailId) : ''),
    method: ((data.mailId !== undefined) ? 'put' : 'post'),
    body: {
      id: data.mailId,
      mail: data.mail,
      name: data.name,
      creationNotice: data.creationNotice_mail,
      deadlineReminder: data.deadlineReminder_mail
    }
  },
  localkey: 'user',
  locally: {
      mailId: data.mailId ? data.mailId : undefined,
      mail: data.mail,
      name: data.name,
      creationNotice: data.creationNotice_mail,
      deadlineReminder: data.deadlineReminder_mail,
      creationNotice_notification: data.creationNotice_notification,
      deadlineReminder_notification: data.deadlineReminder_notification
    }
});

export const save_settings_locally = (data) => ({
  type: 'SAVE_SETTINGS',
  status: 'complete',
  localkey: 'user',
  locally: data
});

export const hide_mail_suggestion = () => ({
  type: 'HIDE_MAIL_SUGGESTION'
});

export const check_mail = (mail) => ({
  type: 'CHECK_MAIL',
  status: 'hidden',
  api: {
    url: '/api/mail/search?email=' + encodeURIComponent(mail),
    method: 'GET'
  }
});

export const select_suggestion = (mail) => ({
  type: 'SELECT_MAIL',
  mail
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

export const start_edit_meal = (id) => ({
  type: 'DIALOG',
  content: 'EDIT_MEAL',
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

