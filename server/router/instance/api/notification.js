const notification = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/notification'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

notification.delete(
  '/:id',
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  controller.delete,
)

notification.post(
  '/',
  validate('body', {
    type: /^(gcm)$/,
  }),
  controller.create,
)

module.exports = notification
