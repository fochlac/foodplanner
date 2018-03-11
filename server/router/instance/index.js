const instance = require('express').Router(),
  api = require('./api'),
  unsubscribe = require(process.env.FOOD_HOME + 'router/controller/unsubscribe'),
  staticRouter = require('../static')

instance.get('/api', api)
instance.get('/unsubscribe', unsubscribe)
instance.use('/', staticRouter)

module.exports = instance
