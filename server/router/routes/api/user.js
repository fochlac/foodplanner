const user = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/user'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

user.post(
  '/:id/logout',
  validate('params', {
    id: /^[0-9]*$/,
  }),
  jwt.clear,
)

user.post(
  '/login',
  validate('body', {
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    hash: /^([A-Za-z0-9+\/]{22,22}|undefined)$/,
  }),
  controller.login,
)

user.get(
  '/',
  jwt.isAdmin,
  controller.getUsersByInstance
)

user.delete(
  '/:user',
  jwt.isAdmin,
  controller.deleteUser
)

user.post(
  '/:user/admin',
  jwt.isAdmin,
  controller.setAdmin(true)
)

user.delete(
  '/:user/admin',
  jwt.isAdmin,
  controller.setAdmin(false)
)

module.exports = user
