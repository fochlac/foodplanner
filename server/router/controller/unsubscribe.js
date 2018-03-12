const userDB = require(process.env.FOOD_HOME + 'modules/db/user'),
  error = require(process.env.FOOD_HOME + 'modules/error')

module.exports = (req, res, next) => {
  let promise

  if (req.query.list) {
    promise = userDB.setUserPropertyById(req.query.id, req.query.list, 0)
  } else {
    promise = Promise.all(['deadlineReminder', 'creationNotice'].map(list => userDB.setUserPropertyById(req.query.id, list, 0)))
  }

  promise.then(() => next()).catch(error.router.internalError(res))
}
