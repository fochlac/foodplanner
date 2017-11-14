export * from './actions/administration'
export * from './actions/datefinder'
export * from './actions/meals'
export * from './actions/signups'
export * from './actions/transactions'
export * from './actions/user'

export const closeDialogOptions = {
  content: '',
  url: '/',
  title: 'Mittagsplaner',
}

// load data

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

// busy

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
