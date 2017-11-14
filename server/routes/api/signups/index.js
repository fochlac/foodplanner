const	signups	    = require('express').Router()
	,	signupsDB 	= require(process.env.FOOD_HOME + 'modules/db/signups')
	,	error 		= require(process.env.FOOD_HOME + 'modules/error');


signups.get('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    signupsDB.getSignupByProperty('id', req.params.id).then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

signups.get('/', (req, res) => {
    signupsDB.getAllSignups().then((signups) => {
        res.status(200).send(signups);
    })
    .catch(error.router.internalError(res));
});

signups.put('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
    comment: /^[^"%;]{0,150}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
}), (req, res) => {
    signupsDB.setSignupByProperty('id', req.params.id, req.body).then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

signups.delete('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    signupsDB.deleteSignupByProperty('id', req.params.id).then(() => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

signups.post('/', error.router.validate('body', {
    comment: /^[^"%;]{0,150}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,50}$/,
}), (req, res) => {
    signupsDB.createSignUp(req.body).then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

module.exports = signups;