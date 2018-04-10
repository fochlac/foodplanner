const mail = require('express').Router(),
  mailController = require(process.env.FOOD_HOME + 'router/controller/mail'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

mail.get('/validate', jwt.requireAdmin, mailController.validateLoginData)

mail.post(
  '/',
  validate('body', {
    gmail_user: /^[\_A-Za-z0-9.\-]{1,50}@gmail\.[A-Za-z]{1,6}$/,
    gmail_pass: ['utf8', /^[^%]{1,100}$/],
  }),
  jwt.requireAdmin,
  mailController.validateAndSaveLoginData,
)

module.exports = mail
