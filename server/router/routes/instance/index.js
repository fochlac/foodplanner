const express = require('express'),
  instance = express.Router(),
  instanceRouter = express.Router(),
  api = require('./api'),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  index = require(process.env.FOOD_HOME + 'router/controller/index').index,
  staticRouter = require('../static'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  instanceMiddleware = require(process.env.FOOD_HOME + 'middleware/instance'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')
  user = require(process.env.FOOD_HOME + 'router/controller/user')

// need to add this this additional level in order to be able to skip this block with next('router')
instance.use(
  '/:instance',
  validate(
    'params',
    {
      instance: /^[0-9]{1,9}$/,
    },
    { nextRouterOnError: true, logLevel: 7 },
  ),
  instanceMiddleware,
  instanceRouter,
)

instanceRouter.use(staticRouter)

instanceRouter.use(jwt.checkToken)
instanceRouter.use('/api', api)

instanceRouter.get('/unsubscribe', unsubscribe)
instanceRouter.get(
  '/resetPassword',
  validate('query', {
    id: /^([A-Za-z0-9+\/=]{24,24})$/,
  }),
  user.finalizeResetPassword,
)

instanceRouter.get('*', index)

module.exports = instance
