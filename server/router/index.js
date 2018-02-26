const routes = require('express').Router(),
  api = require('./api'),
  unsubscribe = require('./unsubscribe')

routes.use('/api', api)
routes.use('/unsubscribe', unsubscribe)

module.exports = routes
