import { closeDialogOptions } from '../actions'

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

export const reset_password = (mail) => ({
  type: 'RESET_PASSWORD',
  status: 'initialized',
  api: {
    url: `/api/user/resetPassword`,
    method: 'POST',
    body: {
      mail,
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

export const searchUser = searchString => ({
  type: 'SEARCH_USER',
  status: 'hidden',
  busyType: 'searchUser',
  api: {
    url: '/api/user/search?search=' + encodeURIComponent(searchString),
    method: 'GET',
  },
})
