const github = require('express').Router(),
  controller = require(process.env.FOOD_HOME + 'router/controller/github'),
  hmac = require(process.env.FOOD_HOME + 'modules/auth/hmac')(process.env.GITHUB_SECRET_FOOD, 'X-Hub-Signature')

github.post('/', hmac, controller.triggerBuild)

module.exports = github
