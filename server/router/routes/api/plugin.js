const plugin = require('express').Router(),
  pluginController = require(process.env.FOOD_HOME + 'router/controller/plugin'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

plugin.get('/', pluginController.list)

plugin.post(
  '/',
  validate('body', {
    title: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    description: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,1000}$/,
    options: 'jsonString',
  }),
  pluginController.create,
)

plugin.put(
  '/:plugin',
  validate(
    'params',
    {
      plugin: /^[0-9]*$/,
    },
    { nextOnError: true },
  ),
  validate('body', {
    title: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    description: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,1000}$/,
    url: /^https:\/\/[A-Za-z0-9\-/._]{0,100}$/,
    options: 'jsonString',
  }),
  pluginController.update,
)

plugin.delete(
  '/:plugin',
  validate(
    'params',
    {
      plugin: /^[0-9]*$/,
    },
    { nextOnError: true },
  ),
  pluginController.update,
)

plugin.post(
  '/:plugin/submit',
  validate(
    'params',
    {
      plugin: /^[0-9]*$/,
    },
    validate('body', {
      method: /^(put|post|delete)$/,
      url: /^[A-Za-z0-9\-/._]{0,100}$/,
      payload: 'jsonString',
    }),
    { nextOnError: true },
  ),
  pluginController.submit,
)

module.exports = plugin
