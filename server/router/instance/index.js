const instance = require('express').Router(),
  api = require('./api'),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  index = require(process.env.FOOD_HOME + 'router/controller/index'),
  staticRouter = require('../static')

instance.get('/api', api)
instance.get('/unsubscribe', unsubscribe)
instance.use('/', staticRouter)
instance.get('*', index)

module.exports = instance
