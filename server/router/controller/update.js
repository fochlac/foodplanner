const error = require(process.env.FOOD_HOME + 'modules/error'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups'),
  datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  caches = require(process.env.FOOD_HOME + 'modules/cache')

let updateCache = caches.getCache('update')

module.exports = {
  update: (req, res) => {
    if (+caches.getVersion() > +req.query.version) {
      log(6, 'responding with update', caches.getVersion(), req.query.version)
      if (updateCache.get('update')) {
        res.status(200).send(updateCache.get('update'))
      } else {
        Promise.all([mealsDB.getAllMeals(), signupsDB.getAllSignups(), datefinderDB.getDatefinders()])
          .then(([allMeals, signups, datefinderList]) => {
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
              historySize: allMeals.length - mealsDB.length
            }

            updateCache.put('update', response)
            res.status(200).send(response)
          })
          .catch(error.router.internalError(res))
      }
    } else {
      res.status(200).send({})
    }
  },

  history: (req, res) => {
    const { page, size } = req.query

    if (updateCache.get(`history-${size}_${page}`)) {
      res.status(200).send(updateCache.get(`history-${size}_${page}`))
    } else {
      Promise.all([mealsDB.getAllMeals(), signupsDB.getAllSignups(), datefinderDB.getDatefinders()])
        .then(([meals, signups, datefinderList]) => {
          const startOfDay = new Date().setHours(0, 0, 0)

          meals = meals.filter(meal => meal.time < startOfDay)

          const historySize = meals.length

          meals = meals.sort((a, b) => b.time - a.time)
            .slice(size * (page - 1), size * page)

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

          const response = {
            signups,
            meals,
            datefinder: datefinderList,
            historySize
          }

          updateCache.put(`history-${size}_${page}`, response)
          res.status(200).send(response)
        })
        .catch(error.router.internalError(res))
    }
  },
}
