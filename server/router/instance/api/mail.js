const mail = require('express').Router(),
  mailController = require(process.env.FOOD_HOME + 'router/controller/mail'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

mail.get(
  '/search',
  validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/,
  }),
  mailController.findMail,
)

mail.post(
  '/invite',
  jwt.requireAdmin,
  validate('body', {
    mail: 'array',
  }),
  mailController.sendInvitation,
)

module.exports = mail
