const datefinder = require('express').Router(),
  datefinderController = require(process.env.FOOD_HOME + 'router/controller/datefinder'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

datefinder.post(
  '/:id/lock',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    date: /^[0-9]{1,9}$/,
  }),
  datefinderController.lock,
)

datefinder.put(
  '/:id/deadline',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    deadline: /^[0-9]{1,15}$/,
  }),
  datefinderController.setDeadline,
)

datefinder.post(
  '/:id/date',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    time: /^[0-9]{1,15}$/,
  }),
  datefinderController.addDate,
)

datefinder.delete(
  '/:id/date',
  jwt.requireAuthentication,
  validate(
    'params',
    {
      id: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    date: /^[0-9]{1,9}$/,
  }),
  datefinderController.deleteDate,
)

datefinder.get('/', datefinderController.list)

datefinder.delete(
  '/:id',
  jwt.requireAuthentication,
  validate(
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
  validate('body', {
    date: /^[0-9]{1,9}$/,
    user: /^[0-9]{1,9}$/,
  }),
  datefinderController.signups.create,
)

datefinder.delete(
  '/signup/',
  jwt.requireAuthentication,
  validate('body', {
    date: /^[0-9]{1,9}$/,
    user: /^[0-9]{1,9}$/,
  }),
  datefinderController.signups.delete,
)

module.exports = datefinder
