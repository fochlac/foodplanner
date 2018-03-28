import { closeDialogOptions } from '../actions'

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
