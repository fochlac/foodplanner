const routes = require('express').Router(),
  instance = require('./instance.js')

routes.use('/instance', instance)

module.exports = routes
