const	mail	     = require('express').Router()
	,	userDB 	     = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   error        = require(process.env.FOOD_HOME + 'modules/error')
	,	mailer 		 = require(process.env.FOOD_HOME + 'modules/mailer');

mail.get('/search', error.router.validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/
}), (req, res) => {
    userDB.searchUsersByProperty('mail', decodeURIComponent(req.query.email)).then((result) => {
        res.status(200).send((result.length === 1) ? result[0] : {error: (result.length ? 'unclear_result' : 'empty_result'), count: result.length});
    })
    .catch(error.router.internalError(res));
});

mail.post('/invite', (req, res) => {
    mailer.sendInvitation(req.body.mail);
    res.status(200).send(mail);
});

module.exports = mail;