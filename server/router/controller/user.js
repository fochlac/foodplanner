const user = require('express').Router(),
  userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  paymentDB = require(process.env.FOOD_HOME + 'modules/db/payment'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  mailer = require(process.env.FOOD_HOME + 'modules/mailer'),
  crypto = require(process.env.FOOD_HOME + 'modules/crypto'),
  cookieOptions = {
    secure: process.env.DEVELOP ? false : true,
    httpOnly: true,
    domain: process.env.FOOD_EXTERNAL.split('.')
      .slice(-2)
      .join('.'),
    expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
  }

let cache = caches.getCache('users'),
  mailCache = caches.getCache('mail'),
  historyCache = caches.getCache('history'),
  authCache = caches.getCache('userAuth'),
  userListCache = caches.getCache('userList')

const handleGetUserById = (id, res) => {
  const user = cache.get('user_' + id)
  if (user) {
    res.cookie('jwt', user.token, cookieOptions)
    res.status(200).send(user)
  } else {
    userDB
      .getUserByProperty('id', id)
      .then(result => {
        log(6, 'got user data', id)
        if (!result) {
          return res.status(200).send({})
        }
        return jwt.createToken(result).then(token => {
          result.token = token
          res.cookie('jwt', token, cookieOptions)
          cache.put('user_' + id, result ? result : undefined)
          res.status(200).send(result)
        })
      })
      .catch(error.router.internalError(res))
  }
}

module.exports = {
  createUser: async (req, res) => {
    crypto
      .createUserHash(req.body.hash)
      .then(({ hash, salt }) => userDB.createUser({ ...req.body, instance: req.instance }, hash, salt))
      .then(user => {
        mailCache.deleteAll()
        userListCache.deleteAll()
        return jwt.createToken(user).then(token => {
          res.cookie('jwt', token, cookieOptions)
          res.status(200).send(user)
        })
      })
      .catch(error.router.internalError(res))
  },

  findUser: async (req, res) => {
    const query = decodeURIComponent(req.query.search)
    let search = cache.get(`${req.instance}_${query}`)
    if (search) {
      res.status(200).send(search)
    } else {
      try {
        const search = await userDB.searchUsersByNameOrMail(req.instance, query)

        cache.put(`${req.instance}_${query}`, search)
        res.status(200).send(search)
      } catch (err) {
        error.router.internalError(res)(err)
      }
    }
  },

  editUser: (req, res) => {
    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s settings`)
      return res.status(403).send({ type: 'FORBIDDEN' })
    }

    crypto
      .createUserHash(req.body.hash)
      .then(({ hash, salt }) => userDB.setUserById(req.params.id, req.body, { hash, salt }))
      .then(user => {
        cache.delete('user_' + req.params.id)
        mailCache.deleteAll()
        userListCache.deleteAll()
        if (req.body.hash) {
          authCache.delete(req.user.mail)
        }

        res.status(200).send(user)
      })
      .catch(error.router.internalError(res))
  },

  resetPassword: async (req, res) => {
    try {
      const user = await userDB.getUserByProperty('mail', req.body.mail)

      if (user.id) {
        log(2, `${req.headers.proxied ? req.headers.proxy_ip : req.connection.remoteAddress} tried to reset password of user ${user.id} with name ${user.name}`)
        const {pass, salt, hash} = await crypto.generateRandomPass()

        await userDB.setUserById(user.id, user, { hash, salt })

        mailer.sendNewPassMail(user, pass)
      } else {
        log(2, `${req.headers.proxied ? req.headers.proxy_ip : req.connection.remoteAddress} tried to reset password with invalid email`)
      }

      res.status(200).json({})
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },

  getUser: (req, res) => {
    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s user data`)
      return res.status(403).send({ status: 403, type: 'FORBIDDEN' })
    }

    handleGetUserById(req.user.id, res)
  },

  login: (req, res) => {
    crypto
      .verifyUser(req.instance, req.body)
      .then(id => {
        handleGetUserById(id, res)
      })
      .catch(error.router.internalError(res))
  },

  sendMoney: (req, res) => {
    if (+req.body.source !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.body.source}'s money`)
      return res.status(403).send({ status: 403, type: 'FORBIDDEN' })
    }

    paymentDB
      .sendMoney(req.body.source, req.params.id, req.body.amount)
      .then(() => {
        cache.delete('user_' + req.params.id)
        cache.delete('history_' + req.params.id)
        cache.delete('user_' + req.body.source)
        cache.delete('history_' + req.body.source)
        historyCache.delete(req.instance)
        userListCache.deleteAll()

        res.status(200).send({ success: true })
      })
      .catch(error.router.internalError(res))
  },

  setUserInactive: inactive => async (req, res) => {
    try {
      const user = await userDB.getUserByProperty('id', req.params.user)

      if (req.user.instance !== user.instance) {
        return res.status(403).json({ status: 403, type: 'FORBIDDEN' })
      }

      await userDB.setUserPropertyById(req.params.user, 'inactive', inactive)
      log(6, `controller/user.js-setUserInactive: ${req.user.id} set user ${user.id} ${inactive ? 'inactive' : 'active'}`)

      cache.delete('user_' + req.params.user)
      userListCache.deleteAll()

      res.status(200).send({ status: 200, type: 'SUCCESS' })
    } catch (err) {
      return error.router.internalError(res)(err)
    }
  },

  setAdmin: del => async (req, res) => {
    try {
      const user = await userDB.getUserByProperty('id', req.params.user)

      if (req.user.instance !== user.instance) {
        return res.status(403).json({ status: 403, type: 'FORBIDDEN' })
      }

      await userDB.setUserPropertyById(req.params.user, 'admin', del)

      log(6, `controller/user.js-setAdmin: set admin for user ${user.id} to ${del}`)

      res.status(200).send({ ...user, admin: del })
    } catch (err) {
      return error.router.internalError(res)(err)
    }
  },

  getUsersByInstance: async (req, res) => {
    log(6, 'getting user list for instance', req.instance)
    try {
      if (+req.instance !== +req.user.instance) {
        log(4, `User ${req.user.id} tried to access instance ${req.instance} without access rights`)
        return res.status(403).send({ type: 'FORBIDDEN' })
      }

      let userList = userListCache.get('instance_' + req.instance)
      if (!userList) {
        userList = await userDB.getUsersByProperty(req.user.instance, 'instance', req.user.instance)
        userListCache.put('instance_' + req.instance, userList)
      }

      log(6, 'got transaction list')
      res.status(200).send(userList)
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },

  transactions: (req, res) => {
    let history = cache.get('history_' + req.params.id)

    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s history`)
      return res.status(403).send({ type: 'FORBIDDEN' })
    }

    if (history) {
      res.status(200).send(history)
    } else {
      paymentDB
        .getHistoryByUserId(req.params.id)
        .then(result => {
          cache.put('history_' + req.params.id, result)
          res.status(200).send(result)
        })
        .catch(error.router.internalError(res))
    }
  },
}
