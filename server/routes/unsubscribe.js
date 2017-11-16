const   unsubscribe     = require('express').Router()
    ,   mailDB          = require(process.env.FOOD_HOME + 'modules/db/mail')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');

unsubscribe.use('/', (req, res, next) => {
    let promise;

    if (req.query.list) {
        promise = mailDB.setMailPropertyById(req.query.id, req.query.list, 0);
    } else {
        promise = mailDB.deleteMailByProperty('id', req.query.id);
    }

    promise.then(() => next()).catch(error.router.internalError(res));
});

module.exports = unsubscribe;