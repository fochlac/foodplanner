import { closeDialogOptions } from '../actions'

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
