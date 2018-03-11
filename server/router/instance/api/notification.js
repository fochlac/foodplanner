const notification = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/notification'),
  error = require(process.env.FOOD_HOME + 'modules/error')

notification.delete(
  '/:id',
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  controller.delete,
)

notification.post(
  '/',
  error.router.validate('body', {
    type: /^(gcm)$/,
  }),
  controller.create,
)

module.exports = notification
