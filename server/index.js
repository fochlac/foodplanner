#!/usr/bin/env node

const express = require('express'),
  app = express(),
  bodyparser = require('body-parser'),
  compression = require('compression'),
  xssFilter = require('x-xss-protection'),
  http = require('http'),
  fs = require('fs'),
  router = require(process.env.FOOD_HOME + 'router'),
  sanitize = require(process.env.FOOD_HOME + 'helper/sanitize'),
  scheduler = require(process.env.FOOD_HOME + 'modules/scheduler'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups'),
  datefinderDB = require(process.env.FOOD_HOME + 'modules/db/datefinder'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  timestamp = require(process.env.FOOD_HOME + 'middleware/timestamp'),
  logger = require(process.env.FOOD_HOME + 'middleware/logger'),
  version = require(process.env.FOOD_HOME + 'modules/cache').getVersion,
  server_port = process.env.FOOD_PORT,
  server_ip_address = 'localhost',
  sslServer = http.createServer(app)

sslServer.listen(server_port, server_ip_address, () => {
  console.log('listening on http://' + server_ip_address + ':' + server_port)
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(compression())
app.use(xssFilter())
app.set('x-powered-by', false)
app.use(timestamp)
app.use(jwt.checkToken)
app.use(logger)

// connect router
app.use('/', router)

// if not connected to a route, deliver static content
app.use('/static/', express.static(process.env.FOOD_CLIENT + ''))

// exception for sw and manifest, needs to be in root
app.use('/sw.js', express.static(process.env.FOOD_CLIENT + 'sw.js'))
app.use('/manifest.json', express.static(process.env.FOOD_CLIENT + 'manifest.json'))

// if no route and no static content, redirect to index
app.get('*', (req, res) => {
  let meals = mealsDB.getAllMeals(),
    signups = signupsDB.getAllSignups(),
    datefinder = datefinderDB.getDatefinders(),
    file = new Promise((resolve, reject) => {
      fs.readFile(process.env.FOOD_CLIENT + 'index.html', 'utf8', (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })

  Promise.all([file, meals, signups, datefinder])
    .then(([file, meals, signups, datefinderList]) => {
      meals = meals.map(meal => {
        meal.signups = signups.filter(signup => signup.meal === meal.id).map(signup => signup.id)
        return meal
      })

      datefinderList = datefinderList.map(datefinder => ({
        ...datefinder,
        dates: JSON.parse(datefinder.dates).map(date => {
          date.users = date.users ? JSON.parse(date.users) : []
          return date
        }),
        participants: datefinder.participants ? JSON.parse(datefinder.participants) : [],
      }))

      signups = signups.reduce((acc, signup) => {
        acc[signup.id] = signup
        return acc
      }, {})

      log(6, 'server/index.js - sending enriched index.html to user ' + (req.auth ? req.user.id : 'unknown'))
      res.status(200).send(
        file.replace(
          '<script>/**DEFAULTSTORE**/</script>',
          `<script>
                    window.defaultStore = {
                        user:${req.auth ? sanitize.html(JSON.stringify(req.user)) : "{name:''}"},
                        app:{dialog:'', errors:{}, dataversion: ${version()}},
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
})

// load scheduler
scheduler.init()
