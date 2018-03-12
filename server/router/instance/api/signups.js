const signups = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/signups'),
  paymentController = require(process.env.FOOD_HOME + 'router/controller/payment'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

signups.post(
  '/:id/paid',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  paymentController.setSignupPaymentStatus(true),
)

signups.delete(
  '/:id/paid',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  paymentController.setSignupPaymentStatus(false),
)

signups.get('/', controller.listAllSignups)

signups.put(
  '/:id',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  validate('body', {
    comment: ['utf8', /.{0,250}/],
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/,
  }),
  controller.editSignup,
)

signups.delete(
  '/:id',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  controller.deleteSignup,
)

signups.post(
  '/',
  validate('body', {
    comment: ['utf8', /.{0,250}/],
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/,
  }),
  controller.createSignup,
)

module.exports = signups
