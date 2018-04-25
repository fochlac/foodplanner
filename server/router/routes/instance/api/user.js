const user = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/user'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

const { sendMoney, editUser, transactions, getUser, createUser, login, findUser, resetPassword, finalizeResetPassword } = controller

user.get('/', jwt.requireAdmin, controller.getUsersByInstance)

user.get(
  '/search',
  validate('query', {
    search: /^[ÄÜÖäöüA-Za-z0-9.\-,\s\_@]{1,100}$/,
  }),
  findUser,
)

user.post(
  '/:id/logout',
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  jwt.clear,
)

user.post(
  '/resetPassword',
  validate('body', {
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
  }),
  resetPassword,
)

user.put(
  '/:id/money',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    source: /^[0-9]{1,9}$/,
    amount: /^[0-9]{1,6}[.0-9]{0,3}$/,
  }),
  sendMoney,
)

user.put(
  '/:id',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/,
    hash: /^([A-Za-z0-9+\/]{22,22}|undefined)$/,
  }),
  editUser,
)

user.get(
  '/:id/history',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  transactions,
)

user.get(
  '/:id',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  getUser,
)

user.post(
  '/',
  validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    hash: /^([A-Za-z0-9+\/]{22,22}|undefined)$/,
  }),
  createUser,
)

user.post(
  '/login',
  validate('body', {
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    hash: /^([A-Za-z0-9+\/]{22,22}|undefined)$/,
  }),
  login,
)

module.exports = user
