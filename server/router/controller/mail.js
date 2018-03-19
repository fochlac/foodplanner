const userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  instanceDB = require(process.env.FOOD_HOME + 'modules/db/instance'),
  mailer = require(process.env.FOOD_HOME + 'modules/mailer')

let cache = caches.getCache('mail'),
  instanceCache = caches.getCache('instance')

module.exports = {
  findMail: (req, res) => {
    let search = cache.get(req.query.email)
    if (search) {
      res.status(200).send(search)
    } else {
      userDB
        .searchUsersByProperty(req.instance, 'mail', decodeURIComponent(req.query.email))
        .then(result => {
          let parsedResult = result.length === 1 ? result[0] : { error: result.length ? 'unclear_result' : 'empty_result', count: result.length }
          cache.put(req.query.email, parsedResult)
          res.status(200).send(parsedResult)
        })
        .catch(error.router.internalError(res))
    }
  },

  sendInvitation: (req, res) => {
    let mailingList = req.body.mail.filter(mail => error.validation.isMail(mail))

    mailer.sendInvitation(mailingList)
    res.status(200).send(mailingList)
  },

  resendCreationNotice: (req, res) => {
    mealsDB
      .getMealById(req.params.id)
      .then(meal => {
        mailer.sendCreationNotice(req.instance, meal)
        res.status(200).send(meal)
      })
      .catch(error.router.internalError(res))
  },

  validateLoginData: async (req, res) => {
    try {
      const valid = await mailer.validateLoginData(req.body)

      res.status(200).json({ valid })
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },

  validateAndSaveLoginData: async (req, res) => {
    try {
      const valid = await mailer.validateLoginData(req.body)

      if (valid) {
        const instance = await instanceDB.setPropsById(req.instance, {
          gmail_user,
          gmail_pass,
        })

        instanceCache.put(req.instance, instance)

        res.status(200).json({ valid, instance })
      } else {
        res.status(200).json({ valid })
      }
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },
}
