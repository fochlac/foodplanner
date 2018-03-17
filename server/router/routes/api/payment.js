const payment = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/payment'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

payment.get(
  '/transactions',
  jwt.isAdmin,
  controller.getTransactionsByInstance
)

module.exports = payment
