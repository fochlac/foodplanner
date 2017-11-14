const fs = require('fs'),
  sanitize = require(process.env.FOOD_HOME + 'helper/sanitize'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  instanceDB = require(process.env.FOOD_HOME + 'modules/db/instance'),
  signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups'),
  datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  version = require(process.env.FOOD_HOME + 'modules/cache').getVersion

module.exports = {
  index: (req, res) => {
    const startOfDay = new Date().setHours(0, 0, 0)
    let meals = mealsDB.getAllMealsByInstance(req.instance),
      signups = signupsDB.getAllSignups(req.instance),
      datefinder = datefinderDB.getDatefinders(req.instance),
      instance = instanceDB.getInstanceById(req.instance),
      file = new Promise((resolve, reject) => {
        fs.readFile(process.env.FOOD_CLIENT + 'index.html', 'utf8', (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })

    Promise.all([file, meals, signups, datefinder, instance])
      .then(([file, allMeals, allSignups, fullDatefinderList, instance]) => {
        let meals = allMeals.filter(meal => meal.time > startOfDay).map(meal => {
          meal.signups = allSignups.filter(signup => signup.meal === meal.id).map(signup => signup.id)
          return meal
        })

        const mealIds = meals.map(meal => meal.id)
        const mealDatefinders = meals.map(meal => meal.datefinder)
        const signups = allSignups.filter(signup => mealIds.includes(signup.meal)).reduce((acc, signup) => {
          acc[signup.id] = signup
          return acc
        }, {})

        const datefinderList = fullDatefinderList.filter(datefinder => mealDatefinders.includes(datefinder.id)).map(datefinder => ({
          ...datefinder,
          dates: JSON.parse(datefinder.dates).map(date => {
            date.users = date.users ? JSON.parse(date.users) : []
            return date
          }),
          participants: datefinder.participants ? JSON.parse(datefinder.participants) : [],
        }))

        const isSubdomain = req.headers.proxied && req.headers.proxy_url !== req.originalUrl

        log(6, 'server/index.js - sending enriched index.html to user ' + (req.auth ? req.user.id : 'unknown'))
        res.status(200).send(
          file.replace(
            '<script>/**DEFAULTSTORE**/</script>',
            `<script>
            window.defaultStore = {
                        instance: ${JSON.stringify({
                          ...instance,
                          root: req.headers.proxied
                            ? req.headers.proxy_protocol + '://' + req.headers.proxy_host + (isSubdomain ? '' : '/' + req.instance)
                            : req.protocol + '://' + req.headers.host + '/' + req.instance,
                          isSubdomain,
                          page: 'instance',
                        })},
                        historyMealMap: {},
                        user:${req.auth ? sanitize.html(JSON.stringify(req.user)) : "{name:''}"},
                        app:{
                          dialog: ${req.dialog ? JSON.stringify(req.dialog) : '{}'},
                          errors:{},
                          busyList: [],
                          dataversion: ${version()},
                          historySize: ${allMeals.length - meals.length}
                        },
                        meals:${sanitize.html(JSON.stringify(meals))},
                        signups:${sanitize.html(JSON.stringify(signups))},
                        datefinder:${sanitize.html(JSON.stringify(datefinderList))}
                      }
                </script>`,
          ),
        )
      })
      .catch(err => {
        log(2, 'server/index.js - error adding data to index.html', err)
        res.status(200).sendFile(process.env.FOOD_CLIENT + 'index.html')
      })
  },
  administration: (req, res) => {
    const instance = req.instance ? instanceDB.getInstanceById(req.instance) : Promise.resolve({}),
      file = new Promise((resolve, reject) => {
        fs.readFile(process.env.FOOD_CLIENT + 'index.html', 'utf8', (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })

    Promise.all([file, instance])
      .then(([file, instance]) => {
        const subdomainName = req.headers.proxied && req.headers.proxy_host.split('.')[0]

        log(6, 'server/index.js - sending enriched admin - index.html to user ' + (req.auth ? req.user.id : 'unknown'))
        res.status(200).send(
          file.replace(
            '<script>/**DEFAULTSTORE**/</script>',
            `<script>
                    window.defaultStore = {
                      instance: ${JSON.stringify({
                        ...instance,
                        root: req.headers.proxied ? req.headers.proxy_protocol + '://' + req.headers.proxy_host : req.protocol + '://' + req.headers.host,
                        isSubdomain: false,
                        page: 'landing',
                        usesProxy: req.headers.proxied,
                      })},
                      historyMealMap: {},
                      user:${req.auth ? sanitize.html(JSON.stringify(req.user)) : "{name:''}"},
                      app:{dialog:${req.dialog ? JSON.stringify(req.dialog) : '{}'}, errors:{}, dataversion: 0, historySize: 0, busyList: []},
                      meals: {},
                      signups:{},
                      datefinder:{}
                    }
                </script>`,
          ),
        )
      })
      .catch(err => {
        log(2, 'server/index.js - error adding data to index.html', err)
        res.status(200).sendFile(process.env.FOOD_CLIENT + 'index.html')
      })
  },
}
