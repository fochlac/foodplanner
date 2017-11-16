const	mail	     = require('express').Router()
	,	mailDB 	     = require(process.env.FOOD_HOME + 'modules/db/mail')
	,	error 		 = require(process.env.FOOD_HOME + 'modules/error');

mail.get('/search', error.router.validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/
}), (req, res) => {
    mailDB.searchMailsByProperty('mail', decodeURIComponent(req.query.email)).then((result) => {
        res.status(200).send((result.length === 1) ? result[0] : {error: (result.length ? 'unclear_result' : 'empty_result'), count: result.length});
    })
    .catch(error.router.internalError(res));
});

mail.put('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {
    mailDB.setMailByProperty('id', req.params.id, req.body).then((mail) => {
        res.status(200).send(mail);
    })
    .catch(error.router.internalError(res));
});

mail.post('/', error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {
    mailDB.createMail(req.body).then((mail) => {
        res.status(200).send(mail);
    })
    .catch(error.router.internalError(res));
});

module.exports = mail;