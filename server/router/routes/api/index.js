const routes = require('express').Router(),
  instance = require('./instance.js'),
  github = require('./github'),
  user = require('./user.js')

routes.use('/github', github)

routes.use('/instance', instance)
routes.use('/user', user)

routes.all('/*', (req, res) => res.status(404).send({ success: 'false', message: 'unknown route' }))

module.exports = routes
