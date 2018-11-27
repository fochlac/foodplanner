const datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  mailer = require(process.env.FOOD_HOME + 'modules/mailer'),
  log = require(process.env.FOOD_HOME + 'modules/log')

const datefinderCache = caches.getCache('datefinder'),
  updateCache = caches.getDeepCache('update'),
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
    const datefinder = datefinderCache.get(`datefinderList-${req.instance}`)

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

              datefinderCache.put(`datefinderList-${req.instance}`, datefinderList)
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
        datefinderCache.delete(`datefinderList-${req.instance}`)
        updateCache(req.instance).deleteAll()
        mealCache.delete(`allMeals-${req.instance}`)
        return mealsDB.getMealByDatefinderLocked(req.params.id)
      })
      .then(results => {
        mailer.sendCreationNotice(req.instance, results)
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
        datefinderCache.delete(`datefinderList-${req.instance}`)
        updateCache(req.instance).deleteAll()
        mealCache.delete(`allMeals-${req.instance}`)
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
        datefinderCache.delete(`datefinderList-${req.instance}`)
        updateCache(req.instance).deleteAll()
        mealCache.delete(`allMeals-${req.instance}`)
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
        datefinderCache.delete(`datefinderList-${req.instance}`)
        updateCache(req.instance).deleteAll()
        mealCache.delete(`allMeals-${req.instance}`)
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
        datefinderCache.delete(`datefinderList-${req.instance}`)
        updateCache(req.instance).deleteAll()
        mealCache.delete(`allMeals-${req.instance}`)
        res.status(200).send({})
      })
      .catch(error.router.internalError(res))
  },

  signups: {
    create: (req, res) => {
      datefinderDB
        .createSignup({ user: req.body.user, date: req.body.date })
        .then(results => {
          datefinderCache.delete(`datefinderList-${req.instance}`)
          updateCache(req.instance).deleteAll()
          res.status(200).send(results)
        })
        .catch(error.router.internalError(res))
    },

    delete: (req, res) => {
      datefinderDB
        .deleteSignup({ user: req.body.user, date: req.body.date })
        .then(() => {
          datefinderCache.delete(`datefinderList-${req.instance}`)
          updateCache(req.instance).deleteAll()
          res.status(200).send({})
        })
        .catch(error.router.internalError(res))
    },
  },
}
