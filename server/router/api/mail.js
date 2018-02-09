const	mail	     = require('express').Router()
  , error        = require(process.env.FOOD_HOME + 'modules/error')
  , jwt          = require(process.env.FOOD_HOME + 'modules/auth/jwt');

mail.get('/search',
  error.router.validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/
  }),
  controller.findMail
);

mail.post('/invite',
  jwt.requireAdmin,
  error.router.validate('body', {
    mail: 'array',
  }),
  controller.sendInvitation
);

module.exports = mail;
