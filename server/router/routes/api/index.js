const routes = require('express').Router(),
  instance = require('./instance.js'),
  user = require('./user.js')

routes.use('/instance', instance)
routes.use('/user', user)

module.exports = routes
