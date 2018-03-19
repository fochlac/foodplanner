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

instance.get(
  '/:instance',
  validate('params', {
    instance: /^[0-9]*$/,
  }),
  jwt.requireAdmin,
  instanceController.getInstance,
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
  instanceController.createInstance,
)

instance.post(
  '/:instance',
  validate('params', {
    instance: /^[0-9]*$/,
  }),
  validate('body', {
    title: /^([ÄÜÖäöüA-Za-z0-9.\-,\s]{0,100}|undefined)$/,
    icon: /^(fa-[A-Za-z0-9-]{0,50}|undefined)$/,
    /*     address: 'jsonString',
    company: 'utf8', */
    lang: /^([_-A-Za-z0-9\-]{0,100}|undefined)$/,
  }),
  instanceController.updateInstance,
)

module.exports = instance
