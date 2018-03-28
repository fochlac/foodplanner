import { closeDialogOptions } from '../actions'

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
