const   unsubscribe     = require('express').Router()
    ,   userDB          = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');

unsubscribe.use('/', (req, res, next) => {
    let promise;

    if (req.query.list) {
        promise = userDB.setMailPropertyById(req.query.id, req.query.list, 0);
    } else {
        promise = Promise.all(['deadlineReminder', 'creationNotice'].map(list => userDB.setMailPropertyById(req.query.id, list, 0)));
    }

    promise.then(() => next()).catch(error.router.internalError(res));
});

module.exports = unsubscribe;