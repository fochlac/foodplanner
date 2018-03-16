const router = require('express').Router(),
  bodyparser = require('body-parser'),
  compression = require('compression'),
  xssFilter = require('x-xss-protection'),
  timestamp = require(process.env.FOOD_HOME + 'middleware/timestamp'),
  routes = require('./routes'),
  logger = require(process.env.FOOD_HOME + 'middleware/logger')

// apply generic middleware
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))
router.use(compression())
router.use(xssFilter())
router.use(timestamp)
router.use(logger)

// connect routes
router.use(routes)

module.exports = router
