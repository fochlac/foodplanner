const routes = require('express').Router(),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  staticRouter = require('./static'),
  instance = require('./instance'),
  bodyparser = require('body-parser'),
  compression = require('compression'),
  xssFilter = require('x-xss-protection'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  timestamp = require(process.env.FOOD_HOME + 'middleware/timestamp'),
  logger = require(process.env.FOOD_HOME + 'middleware/logger')

routes.use(bodyparser.json())
routes.use(bodyparser.urlencoded({ extended: true }))
routes.use(compression())
routes.use(xssFilter())
routes.use(timestamp)
routes.use(jwt.checkToken)
routes.use(logger)

routes.use(instance)

// fallback for direct usage without subdomain
routes.get('/unsubscribe', unsubscribe)
routes.use(staticRouter)

module.exports = routes
