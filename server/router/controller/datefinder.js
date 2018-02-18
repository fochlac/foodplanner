const datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  log = require(process.env.FOOD_HOME + 'modules/log')

const datefinderCache = caches.getCache('datefinder'),
  updateCache = caches.getCache('update');

module.exports = {
  list: (req, res) => {
    const datefinder = datefinderCache.get('datefinderList');

    if (datefinder) {
      res.status(200).send(datefinder)
    } else {
      datefinderDB
        .getDatefinders()
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

  lock: (req,res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => (req.user.id === result.id ? Promise.resolve() : Promise.reject({ status: 403, type: 'FORBIDDEN' })))
      .then(() => datefinderDB.lock(req.params.id))
  },

  create: (req, res) => {
    datefinderDB
      .createDatefinder({ ...req.body, creator: req.user.id })
      .then(results => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
  },

  edit: (req, res) => {
    datefinderDB
      .getDatefinderCreator(req.params.id)
      .then(([result]) => (req.user.id === result.id ? Promise.resolve() : Promise.reject({ status: 403, type: 'FORBIDDEN' })))
      .then(() => datefinderDB.deleteDatefinder({ ...req.params }))
      .then(() => datefinderDB.createSignup({ ...req.body, creator: req.user.id }))
      .then(results => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
  },

  delete: (req, res) => {
    datefinderDB
      .deleteDatefinder({ ...req.params })
      .then(() => {
        datefinderCache.delete('datefinderList')
        updateCache.deleteAll()
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
