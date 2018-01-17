const	mail	     = require('express').Router()
	,	userDB 	     = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   error        = require(process.env.FOOD_HOME + 'modules/error')
    ,   caches       = require(process.env.FOOD_HOME + 'modules/cache')
    ,   jwt          = require(process.env.FOOD_HOME + 'modules/auth/jwt')
	,	mailer 		 = require(process.env.FOOD_HOME + 'modules/mailer');

let cache = caches.getCache('mail');

mail.get('/search', error.router.validate('query', {
    email: /^[_A-Za-z0-9!#$%&'*+-/=?^_`{|}~.\s@]{5,100}$/
}), (req, res) => {
    let search = cache.get(req.query.email);
    if (search) {
        res.status(200).send(search);
    } else {
        userDB.searchUsersByProperty('mail', decodeURIComponent(req.query.email)).then((result) => {
            let parsedResult = (result.length === 1) ? result[0] : {error: (result.length ? 'unclear_result' : 'empty_result'), count: result.length};
            cache.put(req.query.email, parsedResult);
            res.status(200).send(parsedResult);
        })
        .catch(error.router.internalError(res));
    }
});

mail.post('/invite', jwt.requireAdmin, (req, res) => {
    mailer.sendInvitation(req.body.mail);
    res.status(200).send(mail);
});

module.exports = mail;