const routes = require('express').Router(),
  signups = require('./signups'),
  meals = require('./meals'),
  notification = require('./notification'),
  mail = require('./mail'),
  instance = require('./instance'),
  datefinder = require('./datefinder'),
  user = require('./user'),
  github = require('./github'),
  update = require(process.env.FOOD_HOME + 'router/controller/update'),
  history = require(process.env.FOOD_HOME + 'router/controller/history'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

routes.use('/github', github)

routes.get(
  '/update',
  validate(
    'query',
    {
      version: /^([0-9]{0,100}|undefined)$/,
    },
    { hideError: true },
  ),
  update,
)

routes.get(
  '/history',
  validate('query', {
    page: /^([0-9]{0,100})$/,
    size: /^([0-9]{0,100})$/,
  }),
  history,
)

routes.use('/signups', signups)
routes.use('/meals', meals)
routes.use('/user', user)
routes.use('/mail', mail)
routes.use('/instance', instance)
routes.use('/datefinder', datefinder)
routes.use('/notification', notification)

module.exports = routes
