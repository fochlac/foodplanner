const userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  error = require(process.env.FOOD_HOME + 'modules/error')

module.exports = (req, res, next) => {
  let promise

  if (req.query.list) {
    promise = userDB.setUserPropertyById(req.query.id, req.query.list, 0)
    req.dialog = {type: 'UNSUBSCRIBE', params: [{user: req.user, [req.query.list]: 0 }], content: req.query.list}
  } else {
    promise = Promise.all(['deadlineReminder', 'creationNotice'].map(list => userDB.setUserPropertyById(req.query.id, list, 0)))
    req.dialog = {type: 'UNSUBSCRIBE', params: [{user: req.user, creationNotice: 0, deadlineReminder: 0 }], content: 'all'}
  }

  promise.then(() => next()).catch(error.router.internalError(res))
}
