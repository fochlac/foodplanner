const	user	     = require('express').Router()
	,	userDB 	     = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   error        = require(process.env.FOOD_HOME + 'modules/error')
	,	mailer 		 = require(process.env.FOOD_HOME + 'modules/mailer');

user.put('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {
    userDB.setUserByProperty('id', req.params.id, req.body).then((mail) => {
        res.status(200).send(mail);
    })
    .catch(error.router.internalError(res));
});

user.get('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    userDB.getUserByProperty('id', req.params.id).then((result) => {
        res.status(200).send(result ? result : {});
    })
    .catch(error.router.internalError(res));
});

user.post('/', error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {
    userDB.createUser(req.body).then((mail) => {
        res.status(200).send(mail);
    })
    .catch(error.router.internalError(res));
});

module.exports = user;