const userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  caches = require(process.env.FOOD_HOME + 'modules/cache'),
  instanceDB = require(process.env.FOOD_HOME + 'modules/db/instance'),
  mailer = require(process.env.FOOD_HOME + 'modules/mailer')

let cache = caches.getCache('mail'),
  instanceCache = caches.getCache('instance'),
  mailerCache = caches.getCache('mailer')

module.exports = {
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
      const { gmail_user, gmail_pass } = await instanceDB.getInstanceById(req.instance)
      const gmail_state = await mailer.validateLoginData({
        gmail_user,
        gmail_pass,
      })

      res.status(200).json({ gmail_state })
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },

  validateAndSaveLoginData: async (req, res) => {
    try {
      const gmail_state = await mailer.validateLoginData(req.body)

      if (gmail_state) {
        const { gmail_user, gmail_pass } = req.body

        const instance = await instanceDB.setPropsById(req.instance, {
          gmail_user,
          gmail_pass,
        })

        mailerCache.delete(req.instance)
        instanceCache.put(req.instance, instance)

        res.status(200).json({ gmail_state, ...instance })
      } else {
        res.status(200).json({ gmail_state })
      }
    } catch (err) {
      error.router.internalError(res)(err)
    }
  },
}
