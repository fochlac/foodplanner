const datefinderDB  = require(process.env.FOOD_HOME + 'modules/db/datefinder')
  , caches          = require(process.env.FOOD_HOME + 'modules/cache')
  , error           = require(process.env.FOOD_HOME + 'modules/error')
  , log             = require(process.env.FOOD_HOME + 'modules/log');

const signupCache   = caches.getCache('signups');

module.exports = {
  list: (req, res) => {
    datefinderDB.getDatefinders()
    .then((results) => {
      res.status(200).send(results.map(datefinder => {
          const dates = JSON.parse(datefinder.dates);
          const userdate = dates.map(date => {
            date.users = date.users ? JSON.parse(date.users) : []
            return date
          })

          return {
            ...datefinder,
            dates: userdate,
            uservotes: datefinder.uservotes ? JSON.parse(datefinder.uservotes) : []
          }
      }))
    })
    .catch(error.router.internalError(res))
  },

  create: (req, res) => {
    datefinderDB.createDatefinder({...req.body, creator: req.user.id})
    .then((results) => {
      res.status(200).send(results)
    })
    .catch(error.router.internalError(res))
  },

  edit: (req, res) => {
    datefinderDB.getDatefinderCreator({...req.params})
    .then(([id]) => (req.user.id === id) ? Promise.resolve() : Promise.reject({ status: 403, type: 'FORBIDDEN' }))
    .then(() => datefinderDB.deleteDatefinder({...req.params}))
    .then(() => datefinderDB.createSignup({...req.body, creator: req.user.id}))
    .then((results) => {
      res.status(200).send(results)
    })
    .catch(error.router.internalError(res))
  },

  delete: (req, res) => {
    datefinderDB.deleteDatefinder({...req.params})
    .then(() => {
      res.status(200).send({})
    })
    .catch(error.router.internalError(res))
  },

  signups: {
    create: (req, res) => {
      datefinderDB.createSignup({...req.params, ...req.body, user: req.user.id})
      .then((results) => {
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
    },

    edit: (req, res) => {
      datefinderDB.editSignup({...req.params, ...req.body, user: req.user.id})
      .then((results) => {
        res.status(200).send(results)
      })
      .catch(error.router.internalError(res))
    },

    delete: (req, res) => {
      datefinderDB.deleteSignup({...req.params, user: req.user.id})
      .then(() => {
        res.status(200).send({})
      })
      .catch(error.router.internalError(res))
    },
  }
};
