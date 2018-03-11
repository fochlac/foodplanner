const routes = require('express').Router(),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  staticRouter = require('./static'),
  instance = require('./instance'),
  bodyparser = require('body-parser'),
  compression = require('compression'),
  xssFilter = require('x-xss-protection'),
  scheduler = require(process.env.FOOD_HOME + 'modules/scheduler'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  timestamp = require(process.env.FOOD_HOME + 'middleware/timestamp'),
  logger = require(process.env.FOOD_HOME + 'middleware/logger'),
  error = require(process.env.FOOD_HOME + 'modules/error')

routes.use(bodyparser.json())
routes.use(bodyparser.urlencoded({ extended: true }))
routes.use(compression())
routes.use(xssFilter())
routes.set('x-powered-by', false)
routes.use(timestamp)
routes.use(jwt.checkToken)
routes.use(logger)

routes.use(
  '/:instance',
  error.router.validate(
    'params',
    {
      instance: /^[0-9]{1,9}$/,
    },
    { nextOnError: true },
  ),
  (req, res, next) => {
    req.instance = req.params.instance
    next()
  },
  instance,
)

// fallback for direct usage without subdomain
routes.get('/unsubscribe', unsubscribe)
routes.use('/', staticRouter)

module.exports = routes
