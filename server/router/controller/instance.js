const instanceDB = require(process.env.FOOD_HOME + 'modules/db/instance'),
  crypto = require(process.env.FOOD_HOME + 'modules/crypto'),
  userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  request = require('request-promise-native'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  proxy = `http://localhost:${process.env.PROXY_PORT}/proxies`,
  cookieOptions = { secure: process.env.DEVELOP ? false : true, httpOnly: true, expires: new Date(Date.now() + 1000 * 3600 * 24 * 365) }

let cache = caches.getCache('users'),
  mailCache = caches.getCache('mail'),
  authCache = caches.getCache('userAuth'),
  instanceCache = caches.getCache('instance'),
  userListCache = caches.getCache('userList')

module.exports = {
  checkDomainTaken: async (req, res) => {
    const { subdomain } = req.query
    try {
      const subdomains = Object.keys(
        await request({
          uri: proxy,
          json: true,
        }),
      ).map(domain => domain.split('.')[0])

      res.status(200).send(
        !subdomains.includes(subdomain)
          ? {
              isValid: true,
              name: subdomain,
            }
          : { isValid: false },
      )
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },

  createInstance: async (req, res) => {
    try {
      const [instance, userCrypt] = await Promise.all([instanceDB.createInstance(req.body), crypto.createUserHash(req.body.hash)])
      const [user, subdomain] = await Promise.all([
        userDB.createUser({ ...req.body, instance: instance.id, admin: true }, userCrypt.hash, userCrypt.salt),
        request({
          uri: proxy,
          method: 'POST',
          json: true,
          body: {
            host: req.body.subdomain + '.fochlac.com',
            proxy: {
              redirect: false,
              url: '/' + instance.id,
              port: process.env.DEVELOP ? +process.env.FOOD_PORT : 'FOOD_PORT',
            },
          },
        }),
      ])

      mailCache.deleteAll()
      userListCache.deleteAll()
      instanceCache.deleteAll()

      const token = await jwt.createToken(user)

      res.cookie('jwt', token, cookieOptions)
      res.status(200).send({
        user,
        instance: {
          ...instance,
          root: req.headers.proxied ? req.headers.proxy_protocol + '://' + req.headers.proxy_host : req.protocol + '://' + req.headers.host,
          isSubdomain: false,
          page: 'landing',
        },
      })
    } catch (err) {
      error.router.internalError(res)(err)
      try {
        log(6, 'createInstance: trying cleanup')
        instance && instanceDB.deleteInstanceById(instance.id)
        user && userDB.deleteUserByProperty('id', user.id)
        request({
          uri: proxy,
          method: 'DELETE',
          json: true,
          body: {
            host: req.body.subdomain + '.fochlac.com',
          },
        })
      } catch (err) {
        log(3, 'createInstance: cleanup failed', err)
      }
    }
  },

  getInstance: async (req,res) => {
    log(6, 'getting instance data')
    try {
      if (+req.params.instance !== +req.user.instance) {
        log(4, `User ${req.user.id} tried to access instance ${req.instance} without access rights`)
        return res.status(403).send({ type: 'FORBIDDEN' })
      }
      let instanceData = instanceCache.get(req.params.instance)
      if (!instanceData) {
        instanceData = await instanceDB.getInstanceById(req.params.instance)
        instanceCache.put(req.params.instance, instanceData)
      }
      log(6, 'got instance data')
      res.status(200).send(instanceData)

    } catch (err) {
      error.router.internalError(res)(err)
    }
  }
}
