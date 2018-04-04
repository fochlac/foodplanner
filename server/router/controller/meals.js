const signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups'),
  paymentDB = require(process.env.FOOD_HOME + 'modules/db/payment'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  mailer = require(process.env.FOOD_HOME + 'modules/mailer'),
  notification = require(process.env.FOOD_HOME + 'modules/notification'),
  scheduler = require(process.env.FOOD_HOME + 'modules/scheduler'),
  fs = require('fs')

const signupCache = caches.getCache('signups'),
  mealCache = caches.getCache('meals'),
  updateCache = caches.getCache('update'),
  userCache = caches.getCache('users'),
  datefinderCache = caches.getCache('datefinder'),
  userListCache = caches.getCache('userList')

const validateMealOptions = options => {
  return options.some(option => {
    if (!/^[^"%;]{1,150}$/.test(option.name)) {
      return true
    } else if (option.type !== 'toggle' && (!option.values || !option.values.length || !option.values.every(value => /^[^"%;]{1,150}$/.test(value)))) {
      return true
    }

    return false
  })
}

const validateUserCreator = (meal, user) => {
  return mealsDB.getMealById(meal).then(meal => {
    if (meal.creatorId == user) {
      return Promise.resolve()
    } else {
      log(4, `User ${user} tried to change meal ${meal} without being the creator.`)
      return Promise.reject({ status: 403, type: 'FORBIDDEN' })
    }
  })
}

const validateDatefinder = datefinder => {
  if (!Object.keys(datefinder).length) {
    return true
  }
  if (!error.validation.isBigInt(datefinder.deadline)) {
    log(4, 'invalid deadline')
    return false
  }
  if (!error.validation.isBigInt(datefinder.meal_deadline)) {
    log(4, 'invalid meal_deadline')
    return false
  }
  if (!error.validation.isText(datefinder.description)) {
    log(4, 'invalid description')
    return false
  }
  if (!datefinder.dates.every(date => error.validation.isBigInt(date.time))) {
    log(4, 'invalid dates')
    return false
  }
  return true
}

module.exports = {
  createMeal: async (req, res) => {
    let mealData = Object.assign({}, req.body, { options: JSON.parse(req.body.options), datefinder: JSON.parse(req.body.datefinder) })

    if (validateMealOptions(mealData.options)) {
      log(4, 'Options not valid.')
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: ['options'] })
    }

    if (req.file) {
      let splitfile = req.file.filename.split('.')

      mealData.image = ['meal_', splitfile[splitfile.length - 1]]
    } else {
      delete mealData.image
    }
    if (!validateDatefinder(mealData.datefinder)) {
      log(4, 'datefinder not valid.')
      return res.status(400).send({ msg: 'Datefinder not valid.', type: 'Invalid_Request', data: ['datefinder'] })
    }

    // apply datefinder deadline to meal
    if (mealData.datefinder.meal_deadline) {
      mealData.deadline = mealData.datefinder.meal_deadline
    }

    try {
      const datefinder = await (mealData.datefinder && Object.keys(mealData.datefinder).length
        ? datefinderDB.createDatefinder(req.instance, { ...mealData.datefinder, creator: mealData.creatorId })
        : Promise.resolve({}))

      mealData.datefinder = datefinder.id
      mealData.instance = req.instance

      const mealId = await mealsDB.createMeal(mealData)
      log(6, 'router/controller/meals.js: meal created')
      const meal = await mealsDB.getMealById(mealId)
      log(6, 'router/controller/meals.js: got meal data')

      // clear caches
      mealCache.delete('allMeals')
      updateCache.deleteAll()
      datefinderCache.delete('datefinderList')

      // async calls, not gonna wait for them
      mailer.sendCreationNotice(req.instance, meal.datefinder ? { ...meal, deadline: datefinder.deadline } : meal)
      scheduler.scheduleMeal(meal)
      notification.sendCreationNotice(req.instance, meal.datefinder ? { ...meal, deadline: datefinder.deadline } : meal)

      if (req.file) {
        let imageName = meal.image.split('/')
        fs.rename(req.file.path, req.file.destination + imageName[imageName.length - 1], err => {
          error.checkError(3, 'failed renaming ' + req.file.path)(err)
          res.status(200).send({ meal, datefinder })
        })
      } else {
        res.status(200).send({ meal, datefinder })
      }
    } catch (err) {
      return error.router.internalError(res)(err)
    }
  },

  editMeal: (req, res) => {
    let mealData = Object.assign({}, req.body, { options: JSON.parse(req.body.options) })

    if (validateMealOptions(mealData.options)) {
      log(4, 'Options not valid.')
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: ['options'] })
    }

    if (req.file) {
      let splitfile = req.file.filename.split('.')

      mealData.image = ['meal_', req.params.id, '.' + splitfile[splitfile.length - 1]].join('')
    } else {
      delete mealData.image
    }

    validateUserCreator(req.params.id, req.user.id)
      .then(() => mealsDB.setMealById(req.params.id, mealData))
      .then(id => mealsDB.getMealById(id))
      .then(meal => {
        scheduler.rescheduleMeal(meal)
        mealCache.delete(req.params.id)
        mealCache.delete('allMeals')
        updateCache.deleteAll()
        if (req.file) {
          fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function(err, files) {
            if (err) {
              log(5, 'Cant find image for product ' + req.params.id, err)
            }
            let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find(file => -1 !== file.indexOf('meal_' + req.params.id))
            fs.unlink(path, err => {
              if (err) {
                log(2, 'Cant find image for product ' + req.params.id, err)
              }
              fs.rename(req.file.path, req.file.destination + mealData.image, err => {
                error.checkError(3, 'failed renaming ' + req.file.path)(err)
                res.status(200).send(meal)
              })
            })
          })
        } else {
          res.status(200).send(meal)
        }
      })
      .catch(error.router.internalError(res))
  },

  deleteMeal: (req, res) => {
    mealCache.delete(req.params.id)
    mealCache.delete('allMeals')
    signupCache.deleteAll()
    updateCache.deleteAll()

    validateUserCreator(req.params.id, req.user.id)
      .then(() => mealsDB.deleteMealById(req.params.id))
      .then(() => signupsDB.deleteSignupsByMeal(req.params.id))
      .then(data => {
        scheduler.cancelMeal(req.params.id)

        fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function(err, files) {
          if (err) {
            log(2, 'Cant find image for product ' + req.params.id, err)
            return res.status(200).send({})
          }
          let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find(file => -1 !== file.indexOf('meal_' + req.params.id))
          fs.unlink(path, err => {
            if (err) {
              log(2, 'Cant find image for product ' + req.params.id, err)
            }
            res.status(200).send({})
          })
        })
      })
      .catch(error.router.internalError(res))
  },

  listAllMeals: (req, res) => {
    let meal = mealCache.get('allMeals')

    if (meal) {
      res.status(200).send(meal)
    } else {
      mealsDB
        .getAllMealsByInstance(req.instance)
        .then(meals => {
          mealCache.put('allMeals', meals)
          res.status(200).send(meals)
        })
        .catch(error.router.internalError(res))
    }
  },
}
