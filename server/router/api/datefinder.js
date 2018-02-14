const datefinder          = require('express').Router()
  , datefinderController  = require(process.env.FOOD_HOME + 'router/controller/datefinder')
  , jwt                   = require(process.env.FOOD_HOME + 'modules/auth/jwt')
  , error                 = require(process.env.FOOD_HOME + 'modules/error');

const upcoming = (req,res) => res.status(501).send()

datefinder.post('/:id/lock',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  error.router.validate('body', {
    prices: 'array'
  }),
  upcoming
);

datefinder.get('/', datefinderController.list);

datefinder.post('/',
  jwt.requireAuthentication,
  error.router.validate('body', {
    creator: /^[0-9]{1,9}$/,
    description: /^[^"%;]*$/,
    deadline: /^[0-9]{0,15}$/,
    dates: [{
      time: /^[0-9]{1,9}$/,
    }]
  }),
  datefinderController.create
);

datefinder.put('/:id',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  error.router.validate('body', {
    creator: /^[0-9]{1,9}$/,
    description: /^[^"%;]*$/,
    deadline: /^[0-9]{0,15}$/,
    dates: [{
      time: /^[0-9]{1,9}$/,
    }]
  }),
  datefinderController.edit
);

datefinder.delete('/:id',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  datefinderController.delete
);


datefinder.post('/:deadline/signup',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  error.router.validate('body', {
    options: [{
      date: /^[0-9]{1,9}$/,
    }]
  }),
  datefinderController.signups.create
)

datefinder.put('/:deadline/signup/',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  error.router.validate('body', {
    options: [{
      date: /^[0-9]{1,9}$/,
    }]
  }),
  datefinderController.signups.edit
)

datefinder.delete('/:deadline/signup/',
  jwt.requireAuthentication,
  error.router.validate('params', {
    id: /^[0-9]{1,9}$/
  }),
  error.router.validate('params', {
    id: /^[0-9]{1,14}$/,
    signupId: /^[0-9]{1,14}$/,
  }),
  datefinderController.signups.delete
)

module.exports = datefinder;
