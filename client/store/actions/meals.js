import { closeDialogOptions } from '../actions'

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
