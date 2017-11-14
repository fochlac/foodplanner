const meals = require('express').Router(),
  mealController = require(process.env.FOOD_HOME + 'router/controller/meals'),
  paymentController = require(process.env.FOOD_HOME + 'router/controller/payment'),
  mailController = require(process.env.FOOD_HOME + 'router/controller/mail'),
  image = require(process.env.FOOD_HOME + 'middleware/singleImage'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  validate = require(process.env.FOOD_HOME + 'middleware/validate')

meals.post(
  '/:id/lock',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  validate('body', {
    prices: 'array',
  }),
  paymentController.lockMeal,
)

meals.post(
  '/:id/prices',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  validate('body', {
    prices: 'array',
  }),
  paymentController.savePrices,
)

meals.get('/', mealController.listAllMeals)

meals.put(
  '/:id',
  image.single('imageData'),
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    description: 'utf8',
    time: /^[0-9]{1,15}$/,
    deadline: /^[0-9]{0,15}$/,
    signupLimit: /^[0-9]{0,9}$/,
    options: 'jsonString',
  }),
  mealController.editMeal,
)

meals.delete(
  '/:id',
  jwt.requireAuthentication,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  mealController.deleteMeal,
)

meals.post(
  '/',
  image.single('imageData'),
  jwt.requireAuthentication,
  validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    creator: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,70}$/,
    creatorId: /^[0-9]{1,14}$/,
    description: 'utf8',
    time: /^[0-9]{1,50}$/,
    deadline: /^[0-9]{0,50}$/,
    signupLimit: /^[0-9]{0,50}$/,
    options: 'jsonString',
    datefinder: 'jsonString',
  }),
  mealController.createMeal,
)

meals.post(
  '/:id/mail',
  jwt.requireAdmin,
  validate('params', {
    id: /^[0-9]{1,9}$/,
  }),
  mailController.resendCreationNotice,
)

module.exports = meals
