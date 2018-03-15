const instance = require('express').Router(),
  instanceController = require(process.env.FOOD_HOME + 'router/controller/instance'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

instance.get(
  '/domain',
  validate('query', {
    subdomain: /^[_A-Za-z0-9\-]{4,100}$/,
  }),
  (req, res) => instanceController.checkDomainTaken(req, res).catch(error.router.internalError(res)),
)

instance.post(
  '/',
  validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    hash: /^([A-Za-z0-9+\/]{22,22})$/,
    address: 'jsonString',
    company: 'utf8',
    subdomain: /^[_A-Za-z0-9\-]{4,100}$/,
  }),
  (req, res) => instanceController.createInstance(req, res).catch(error.router.internalError(res)),
)

module.exports = instance
