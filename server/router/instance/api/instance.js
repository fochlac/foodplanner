const instance = require('express').Router(),
  instanceController = require(process.env.FOOD_HOME + 'router/controller/instance'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

instance.get(
  '/domain',
  validate('query', {
    subdomain: /^[_A-Za-z0-9\-]{4,100}$/,
  }),
  instanceController.checkDomainTaken,
)

instance.post(
  '/',
  validate('body', {

  }),
  instanceController.createInstance,
)

module.exports = instance
