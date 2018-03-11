const staticRouter = require('express').Router(),
  api = require('./api'),
  unsubscribe = require('./unsubscribe')

// if not connected to a route, deliver static content
staticRouter.use('/static/', express.static(process.env.FOOD_CLIENT + ''))

// exception for sw and manifest, needs to be in root
staticRouter.use('/sw.js', express.static(process.env.FOOD_CLIENT + 'sw.js'))
staticRouter.use('/manifest.json', express.static(process.env.FOOD_CLIENT + 'manifest.json'))

module.exports = staticRouter
