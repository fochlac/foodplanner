const userDB = require(process.env.FOOD_HOME + 'modules/db/user')
  , error = require(process.env.FOOD_HOME + 'modules/error')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , mailer = require(process.env.FOOD_HOME + 'modules/mailer');

let cache = caches.getCache('mail');

module.exports = {
  findMail: (req, res) => {
    let search = cache.get(req.query.email);
    if (search) {
      res.status(200).send(search);
    } else {
      userDB.searchUsersByProperty('mail', decodeURIComponent(req.query.email)).then((result) => {
        let parsedResult = (result.length === 1) ? result[0] : { error: (result.length ? 'unclear_result' : 'empty_result'), count: result.length };
        cache.put(req.query.email, parsedResult);
        res.status(200).send(parsedResult);
      })
      .catch(error.router.internalError(res));
    }
  },

  sendInvitation: (req, res) => {
    let mailingList = req.body.mail.filter(mail => error.validation.isMail(mail))

    mailer.sendInvitation(mailingList);
    res.status(200).send(mailingList);
  }
}
