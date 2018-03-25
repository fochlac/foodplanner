import { createHash } from 'UTILS/crypto.js'

const closeDialogOptions = {
  content: '',
  url: '/',
  title: 'Mittagsplaner',
}

export const initial_meals = hidden => ({
  type: 'INITIAL_MEALS',
  status: hidden ? 'hidden' : 'initialized',
  api: {
    url: '/api/meals',
    method: 'get',
  },
  enqueue: initial_signups.bind(null, hidden),
})

export const initial_user = localSettings => ({
  type: 'INITIAL_USER',
  localSettings,
})

export const initial_signups = hidden => ({
  type: 'INITIAL_SIGNUPS',
  status: hidden ? 'hidden' : 'initialized',
  api: {
    url: '/api/signups',
    method: 'get',
  },
})

export const refresh = version => ({
  type: 'REFRESH',
  status: 'hidden',
  busyType: 'refresh',
  api: {
    url: `/api/update?version=${version}`,
    method: 'get',
  },
})

export const load_history = ({ page = 1, size = 5, busy = false }) => ({
  type: 'LOAD_HISTORY',
  status: busy ? 'initialized' : 'hidden',
  busyType: 'history',
  page,
  size,
  api: {
    url: `/api/history?page=${page}&size=${size}`,
    method: 'get',
  },
})

export const apply_history = opt => ({
  type: 'HISTORY',
  app: opt.app,
})

export const set_busy = state => ({
  type: 'BUSY',
  state,
})

export const set_hidden_busy = (state, { final, busyType }) => ({
  type: 'HIDDEN_BUSY',
  state,
  final,
  busyType,
})

// service worker

export const connect_serviceworker = data => ({
  type: 'CONNECT_SERVICEWORKER',
  status: 'hidden',
  api: {
    url: '/api/notification',
    method: 'post',
    body: {
      type: 'gcm',
      subscription: data,
    },
  },
})

export const convert_postmessage = evt => ({
  type: 'POSTMESSAGE',
  message: evt.data.message,
  payload: evt.data.payload,
})

// general dialog

export const close_dialog = id => ({
  type: 'DIALOG',
  ...closeDialogOptions,
})

// transactions

export const show_transaction_history = id => ({
  type: 'DIALOG',
  content: 'OPEN_TRANSACTIONS',
  url: '/konto',
  title: 'Mittagsplaner - Kontoübersicht',
})

export const get_transaction_history = id => ({
  type: 'TRANSACTIONS',
  status: 'hidden',
  api: {
    url: `/api/user/${id}/history`,
    method: 'get',
  },
})

export const start_send_money = id => ({
  type: 'DIALOG',
  content: 'SEND_MONEY',
  url: '/bezahlung',
  title: 'Mittagsplaner - Geld senden',
  config: true,
})

export const show_incoming_payments = () => ({
  type: 'DIALOG',
  content: 'INCOMING_PAYMENTS',
  url: '/bezahlung',
  title: 'Mittagsplaner - Ausstehende Zahlungen',
})

export const send_money = data => ({
  type: 'SEND_MONEY',
  status: 'initialized',
  ...data,
  ...closeDialogOptions,
  api: {
    url: `/api/user/${data.target}/money`,
    method: 'put',
    body: data,
  },
})

// impressum

export const show_impressum = () => ({
  type: 'DIALOG',
  content: 'OPEN_IMPRESSUM',
  url: '/impressum',
  title: 'Mittagsplaner - Impressum',
})

// error

export const create_error = (id, msg) => ({
  type: 'SHOW_ERROR',
  content: msg,
  id: id,
})

export const delete_error = id => ({
  type: 'DELETE_ERROR',
  id: id,
})

// signups

export const toggle_paid = (id, state) => ({
  type: 'SIGNUP_PAID',
  status: 'initialized',
  state,
  id,
  api: {
    url: `/api/signups/${id}/paid`,
    method: state ? 'post' : 'delete',
    body: {},
  },
})

export const start_meal_signup = id => ({
  type: 'DIALOG',
  content: 'MEAL_SIGNUP',
  option: { meal: id },
  url: '/anmeldung',
  title: 'Mittagsplaner - Anmeldung',
  config: true,
})

export const meal_signup = data => ({
  type: 'MEAL_SIGNUP',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: '/api/signups',
    method: 'post',
    body: {
      name: data.name,
      comment: data.comment,
      userId: data.userId,
      options: data.options,
      meal: data.meal,
    },
  },
})

export const start_meal_edit = id => ({
  type: 'DIALOG',
  content: 'MEAL_EDIT',
  option: { signup: id },
  url: '/anmeldung',
  title: 'Mittagsplaner - Anmeldung bearbeiten',
  config: true,
})

export const meal_edit = data => ({
  type: 'MEAL_EDIT',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: '/api/signups/' + data.signup,
    method: 'put',
    body: {
      name: data.name,
      options: data.options,
      comment: data.comment,
      meal: data.meal,
    },
  },
})

export const meal_cancel = id => ({
  type: 'MEAL_CANCEL',
  status: 'initialized',
  id: id,
  api: {
    url: '/api/signups/' + id,
    method: 'delete',
  },
})

// meals
export const create_meal_dialog = () => ({
  type: 'DIALOG',
  content: 'CREATE_MEAL',
  url: '/angebot',
  title: 'Mittagsplaner - Angebot erstellen',
  config: true,
})

export const create_meal = data => ({
  type: 'CREATE_MEAL',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: '/api/meals',
    method: 'post',
    headers: 'formdata',
    body: data,
  },
})

export const submit_prices = (prices, mealId) => ({
  type: 'SUBMIT_PRICES',
  status: 'initialized',
  ...closeDialogOptions,
  prices,
  mealId,
  api: {
    url: `/api/meals/${mealId}/prices`,
    method: 'post',
    body: { prices },
  },
})

export const start_payment = (prices, mealId) => ({
  type: 'FINALIZE_PRICES',
  status: 'initialized',
  prices,
  mealId,
  api: {
    url: `/api/meals/${mealId}/lock`,
    method: 'post',
    body: { prices },
  },
})

export const start_edit_meal = id => ({
  type: 'DIALOG',
  content: 'EDIT_MEAL',
  option: { meal: id },
  url: '/angebot',
  title: 'Mittagsplaner - Angebot bearbeiten',
  config: true,
})

export const start_edit_price = id => ({
  type: 'DIALOG',
  content: 'EDIT_PRICE',
  option: { meal: id },
  url: '/preise',
  title: 'Mittagsplaner - Preise festlegen',
  config: true,
})

export const edit_meal = (id, data) => ({
  type: 'EDIT_MEAL',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: '/api/meals/' + id,
    method: 'put',
    headers: 'formdata',
    body: data,
  },
})

export const start_cancel_meal = id => ({
  type: 'DIALOG',
  content: 'CANCEL_MEAL',
  option: { meal: id },
  url: '/angebot',
  title: 'Mittagsplaner - Angebot zurückziehen',
  config: true,
})

export const cancel_meal = id => ({
  type: 'CANCEL_MEAL',
  status: 'initialized',
  ...closeDialogOptions,
  id: id,
  api: {
    url: '/api/meals/' + id,
    method: 'delete',
  },
})

export const meal_set_print = ids => ({
  type: 'PRINT_MEAL',
  ids,
})

export const start_print = () => ({
  type: 'DIALOG',
  content: 'PRINT_MEAL',
  url: '/print',
})

// settings dialog

export const create_settings_dialog = () => ({
  type: 'DIALOG',
  content: 'OPEN_SETTINGS',
  url: '/einstellungen',
  title: 'Mittagsplaner - Einstellungen',
  config: true,
})

export const save_settings = (data, hash) => ({
  type: 'SAVE_SETTINGS',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: '/api/user/' + data.id,
    method: 'put',
    body: {
      id: data.id,
      mail: data.mail,
      name: data.name,
      hash,
      creationNotice: data.creationNotice,
      deadlineReminder: data.deadlineReminder,
    },
  },
  enqueue: resData => save_settings_locally(data),
})

export const save_settings_locally = data => ({
  type: 'SAVE_SETTINGS',
  status: 'complete',
  ...closeDialogOptions,
  localkey: 'user',
  locally: {
    creationNotice_notification: data.creationNotice_notification,
    deadlineReminder_notification: data.deadlineReminder_notification,
  },
})

export const check_mail = mail => ({
  type: 'CHECK_MAIL',
  status: 'hidden',
  api: {
    url: '/api/mail/search?email=' + encodeURIComponent(mail),
    method: 'GET',
  },
})

export const sign_out = id => ({
  type: 'SIGNOUT',
  status: 'initialized',
  api: {
    url: `/api/user/${id}/logout`,
    method: 'POST',
  },
  localkey: 'user',
  locally: {},
})

export const sign_in = ({ mail, hash }) => ({
  type: 'SIGNIN',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: `/api/user/login`,
    method: 'POST',
    body: {
      mail,
      hash,
    },
  },
})

export const register = ({ mail, hash, name }) => ({
  type: 'REGISTER',
  status: 'initialized',
  ...closeDialogOptions,
  api: {
    url: `/api/user/`,
    method: 'POST',
    body: {
      name,
      mail,
      hash,
    },
  },
  enqueue: create_settings_dialog,
})

export const start_sign_in = ({ hideRegister = false }) => ({
  type: 'DIALOG',
  content: 'LOGIN',
  url: '/login',
  option: { hideRegister },
  title: 'Mittagsplaner - Anmelden',
})

// datefinder

export const datefinderToggleDate = ({ selected, user, date }) => ({
  type: 'TOGGLE_DATEFINDER_SIGNUP',
  status: 'hidden',
  date,
  user,
  selected,
  api: {
    url: `/api/datefinder/signup`,
    /* if current state is selected, delete signup */
    method: selected ? 'DELETE' : 'POST',
    body: {
      user: user.id,
      date,
    },
  },
})

export const datefinderFinalize = (id, date) => ({
  type: 'FINALIZE_DATEFINDER',
  status: 'initialized',
  id,
  date,
  api: {
    url: `/api/datefinder/${id}/lock`,
    method: 'POST',
    body: {
      date,
    },
  },
})

export const datefinderStartDeleteDate = (datefinder, date) => ({
  type: 'DIALOG',
  content: 'DATEFINDER_DELETE_DATE',
  option: { datefinder, date },
  url: '/datefinder',
  title: 'Mittagsplaner - Terminplaner',
})

export const datefinderDeleteDate = (datefinder, date) => ({
  type: 'DATEFINDER_DELETE_DATE',
  status: 'initialized',
  ...closeDialogOptions,
  datefinder,
  date,
  api: {
    url: `/api/datefinder/${datefinder}/date`,
    method: 'DELETE',
    body: {
      date,
    },
  },
})

export const datefinderStartAddDate = datefinder => ({
  type: 'DIALOG',
  content: 'DATEFINDER_ADD_DATE',
  option: { datefinder },
  url: '/datefinder',
  title: 'Mittagsplaner - Terminplaner',
})

export const datefinderAddDate = ({ datefinder, time }) => ({
  type: 'DATEFINDER_ADD_DATE',
  status: 'initialized',
  ...closeDialogOptions,
  datefinder,
  time,
  api: {
    url: `/api/datefinder/${datefinder}/date`,
    method: 'POST',
    body: {
      time,
    },
  },
})

export const datefinderSetDeadline = ({ datefinder, deadline }) => ({
  type: 'DATEFINDER_SET_DEADLINE',
  status: 'initialized',
  datefinder,
  deadline,
  api: {
    url: `/api/datefinder/${datefinder}/deadline`,
    method: 'PUT',
    body: {
      deadline,
    },
  },
})

export const createInstance = ({ name, mail, hash, address, company, subdomain }) => ({
  type: 'CREATE_INSTANCE',
  status: 'initialized',
  api: {
    url: `/api/instance`,
    method: 'POST',
    body: {
      name,
      mail,
      hash,
      address,
      company,
      subdomain,
    },
  },
})

export const checkDomain = subdomain => ({
  type: 'CHECK_DOMAIN',
  status: 'hidden',
  busyType: 'domainCheck',
  api: {
    url: `/api/instance/domain?subdomain=${subdomain}`,
    method: 'get',
  },
})

export const setAdmin = ({ user, admin }) => ({
  type: 'SET_ADMIN',
  status: 'initialized',
  user,
  admin,
  api: {
    url: `/api/user/${user}/admin`,
    method: admin ? 'post' : 'delete',
  },
})

export const deleteUser = ({ user }) => ({
  type: 'DELETE_USER',
  status: 'initialized',
  user,
  api: {
    url: `/api/user/${user}`,
    method: 'delete',
  },
})

export const loadAllUsers = instance => ({
  type: 'LOAD_ALL_USERS',
  status: 'initialized',
  api: {
    url: `/${instance}/api/user`,
    method: 'get',
  },
})

export const loadAllTransactions = instance => ({
  type: 'LOAD_ALL_TRANSACTIONS',
  status: 'initialized',
  api: {
    url: `/${instance}/api/payment/transactions`,
    method: 'get',
  },
})

export const loadInstance = instance => ({
  type: 'LOAD_INSTANCE',
  status: 'initialized',
  api: {
    url: `/api/instance/${instance}`,
    method: 'get',
  },
})

export const validateGmail = instance => ({
  type: 'VALIDATE_MAIL',
  status: 'hidden',
  busyType: 'gmail',
  instance,
  api: {
    url: `/${instance}/api/mail/validate`,
    method: 'get',
  },
})

export const saveGmail = (instance, { gmail_user, gmail_pass }) => ({
  type: 'SAVE_MAIL',
  status: 'hidden',
  busyType: 'gmail',
  instance,
  api: {
    url: `/${instance}/api/mail/`,
    method: 'post',
    body: {
      gmail_user,
      gmail_pass,
    },
  },
})

export const saveInstanceData = (instance, { icon, title, company, address, lang, name }) => ({
  type: 'SAVE_INSTANCE',
  status: 'hidden',
  busyType: 'saveInstance',
  instance,
  api: {
    url: `/api/instance/${instance}`,
    method: 'put',
    body: {
      instance,
      icon,
      title,
      company,
      address,
      lang,
      name,
    },
  },
})
