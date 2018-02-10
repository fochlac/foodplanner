const mail            = require('express').Router()
  , mailController    = require(process.env.FOOD_HOME + 'router/controller/mail')
  , error             = require(process.env.FOOD_HOME + 'modules/error')
  , jwt               = require(process.env.FOOD_HOME + 'modules/auth/jwt');

mail.get('/search',
  error.router.validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/
  }),
  mailController.findMail
);

mail.post('/invite',
  jwt.requireAdmin,
  error.router.validate('body', {
    mail: 'array',
  }),
  mailController.sendInvitation
);

module.exports = mail;
