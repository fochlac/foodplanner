const signups   = require('express').Router()
  , controller  = require(process.env.FOOD_HOME + 'router/controller/signups')
  ,	error       = require(process.env.FOOD_HOME + 'modules/error')
  , jwt         = require(process.env.FOOD_HOME + 'modules/auth/jwt');

signups.post('/:id/paid',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  controller.setSignupPaymentStatus(true)
);

signups.delete('/:id/paid',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  controller.setSignupPaymentStatus(false)
);

signups.get('/', controller.listAllSignups);

signups.put('/:id',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }), error.router.validate('body', {
    comment: /^[^"%;]{0,150}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/
  }),
  controller.editSignup
);

signups.delete('/:id',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  controller.deleteSignup
);

signups.post('/',
  error.router.validate('body', {
    comment: /^[^"%;]{0,250}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/
  }),
  controller.createSignup
);

module.exports = signups;
