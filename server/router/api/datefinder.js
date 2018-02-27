const datefinder = require('express').Router(),
  datefinderController = require(process.env.FOOD_HOME + 'router/controller/datefinder'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  error = require(process.env.FOOD_HOME + 'modules/error')

datefinder.post(
  '/:id/lock',
  jwt.requireAuthentication,
  error.router.validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  error.router.validate('body', {
    date: /^[0-9]{1,9}$/,
  }),
  datefinderController.lock,
)

datefinder.get('/', datefinderController.list)

datefinder.delete(
  '/:id',
  jwt.requireAuthentication,
  error.router.validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  datefinderController.delete,
)

datefinder.post(
  '/signup',
  jwt.requireAuthentication,
  error.router.validate('body', {
    date: /^[0-9]{1,9}$/,
    user: /^[0-9]{1,9}$/,
  }),
  datefinderController.signups.create,
)

datefinder.delete(
  '/signup/',
  jwt.requireAuthentication,
  error.router.validate('body', {
    date: /^[0-9]{1,9}$/,
    user: /^[0-9]{1,9}$/,
  }),
  datefinderController.signups.delete,
)

module.exports = datefinder
