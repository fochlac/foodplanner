const express = require('express'),
  instance = express.Router(),
  instanceRouter = express.Router(),
  api = require('./api'),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  index = require(process.env.FOOD_HOME + 'router/controller/index'),
  staticRouter = require('../static'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

// need to add this this additional level in order to be able to skip this block with next('router')
instance.use(
  '/:instance',
  validate(
    'params',
    {
      instance: /^[0-9]{1,9}$/,
    },
    { nextRouterOnError: true },
  ),
  (req, res, next) => {
    req.instance = req.params.instance
    next()
  },
  instanceRouter,
)

instanceRouter.use('/api', api)
instanceRouter.get('/unsubscribe', unsubscribe)
instanceRouter.use(staticRouter)
instanceRouter.get('*', index)

module.exports = instance
