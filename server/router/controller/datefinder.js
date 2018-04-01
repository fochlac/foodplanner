const datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  log = require(process.env.FOOD_HOME + 'modules/log')

const datefinderCache = caches.getCache('datefinder'),
  updateCache = caches.getCache('update'),
  mealCache = caches.getCache('meals')

const validateCreator = (id, creator) => {
  if (id === creator) {
    return Promise.resolve()
  }
  log(4, `User ${id} tried to edit datefinder ${req.params.id} without being the creator (${creator}).`)
  return Promise.reject({ status: 403, type: 'FORBIDDEN' })
}

const validateCreatorAndCallDBAction = action => {}

module.exports = {
  list: (req, res) => {
    const datefinder = datefinderCache.get('datefinderList')

    if (datefinder) {
      res.status(200).send(datefinder)
    } else {
      datefinderDB
        .getDatefinders(req.instance)
        .then(results => {
          res.status(200).send(
            results.map(datefinders => {
              const dates = JSON.parse(datefinder.dates).map(date => {
                date.users = date.users ? JSON.parse(date.users) : []
                return date
              })
              const datefinderList = {
                ...datefinder,
                dates,
                participants: datefinder.participants ? JSON.parse(datefinder.participants) : [],
              }

              mealCache.put('datefinderList', datefinderList)
              return datefinderList
            }),
          )
        })
        .catch(error.router.internalError(res))
    }
  },

  lock: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => validateCreator(req.user.id, result.creator))
      .then(() => datefinderDB.lockDatefinder({ id: req.params.id, date: req.body.date }))
      .then(() => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        mealCache.delete('allMeals')
        return mealsDB.getMealByDatefinderLocked(req.params.id)
      })
      .then(results => {
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
  },

  addDate: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => validateCreator(req.user.id, result.creator))
      .then(() => datefinderDB.addDatefinderDate({ datefinder: req.params.id, ...req.body }))
      .then(results => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        mealCache.delete('allMeals')
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
  },

  deleteDate: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => validateCreator(req.user.id, result.creator))
      .then(() => datefinderDB.deleteDatefinderDate({ datefinder: req.params.id, ...req.body }))
      .then(() => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        mealCache.delete('allMeals')
        res.status(200).send({})
      })
      .catch(error.router.internalError(res))
  },

  setDeadline: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => validateCreator(req.user.id, result.creator))
      .then(() => datefinderDB.setDatefinderDeadline({ datefinder: req.params.id, ...req.body }))
      .then(results => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        mealCache.delete('allMeals')
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
  },

  delete: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => validateCreator(req.user.id, result.creator))
      .deleteDatefinder({ ...req.params })
      .then(() => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        mealCache.delete('allMeals')
        res.status(200).send({})
      })
      .catch(error.router.internalError(res))
  },

  signups: {
    create: (req, res) => {
      datefinderDB
        .createSignup({ user: req.body.user, date: req.body.date })
        .then(results => {
          datefinderCache.delete('datefinderList')
          updateCache.deleteAll()
          res.status(200).send(results)
        })
        .catch(error.router.internalError(res))
    },

    delete: (req, res) => {
      datefinderDB
        .deleteSignup({ user: req.body.user, date: req.body.date })
        .then(() => {
          datefinderCache.delete('datefinderList')
          updateCache.deleteAll()
          res.status(200).send({})
        })
        .catch(error.router.internalError(res))
    },
  },
}
