const error = require(process.env.FOOD_HOME + 'modules/error'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups'),
  paymentDB = require(process.env.FOOD_HOME + 'modules/db/payment'),
  datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  caches = require(process.env.FOOD_HOME + 'modules/cache')

let updateCache = caches.getCache('update')

module.exports = (req, res) => {
  if (+caches.getVersion() > +req.query.version) {
    log(6, 'responding with update', caches.getVersion(), req.query.version)
    if (updateCache.get('update_' + req.user.id)) {
      res.status(200).send(updateCache.get('update_' + req.user.id))
    } else {
      const debts = req.auth ? paymentDB.getUnpaidSignups(req.user.id) : Promise.resolve([])

      Promise.all([mealsDB.getAllMealsByInstance(req.instance), signupsDB.getAllSignups(req.instance), datefinderDB.getDatefinders(req.instance), debts])
        .then(([allMeals, signups, datefinderList, debts]) => {
          const startOfDay = new Date().setHours(0, 0, 0)

          meals = allMeals.filter(meal => meal.time > startOfDay)

          const mealIds = meals.map(meal => meal.id)
          const mealDatefinders = meals.map(meal => meal.datefinder)

          signups = signups.filter(signup => mealIds.includes(signup.meal))
          datefinderList = datefinderList.filter(datefinder => mealDatefinders.includes(datefinder.id))

          datefinderList = datefinderList.map(datefinder => ({
            ...datefinder,
            dates: JSON.parse(datefinder.dates).map(date => {
              date.users = date.users ? JSON.parse(date.users) : []
              return date
            }),
            participants: datefinder.participants ? JSON.parse(datefinder.participants) : [],
          }))

          let response = {
            signups,
            meals,
            datefinder: datefinderList,
            version: caches.getVersion() + 1,
            historySize: allMeals.length - meals.length,
            debts
          }

          updateCache.put('update_' + req.user.id, response)
          res.status(200).send(response)
        })
        .catch(error.router.internalError(res))
    }
  } else {
    res.status(200).send({})
  }
}
