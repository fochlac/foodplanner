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
        Promise.all([mealsDB.getAllMeals(), signupsDB.getAllSignups(), datefinderDB.list()])
          .then(([meals, signups, datefinder]) => {
            let response = {
              signups,
              meals,
              datefinder,
              version: caches.getVersion() + 1,
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
}
