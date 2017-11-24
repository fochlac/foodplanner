const	signups	    = require('express').Router()
    ,   signupsDB   = require(process.env.FOOD_HOME + 'modules/db/signups')
	,	mealsDB 	= require(process.env.FOOD_HOME + 'modules/db/meals')
	,	error 		= require(process.env.FOOD_HOME + 'modules/error')
    ,   log         = require(process.env.FOOD_HOME + 'modules/log');


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
    signupsDB.setSignupById(req.params.id, req.body).then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

signups.delete('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    signupsDB.deleteSignupById(req.params.id).then(() => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

signups.post('/', error.router.validate('body', {
    comment: /^[^"%;]{0,150}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,50}$/,
}), (req, res) => {
    Promise.all([
        mealsDB.getMealByProperty('id', req.body.meal),
        signupsDB.getSignupsByProperty('meal', req.body.meal)
    ])
    .then(result => {
        if (result[0].signupLimit && result[0].signupLimit <= result[1].length) {
            return Promise.reject({type: 1, msg: 'Dieses Angebot ist bereits voll belegt.'});
        }
        return signupsDB.createSignUp(req.body)
    })
    .then((signup) => {
        res.status(200).send(signup);
    })
    .catch(err => {
        if (err.type === 1) {
            log(4, err.msg)
            res.status(400).send(err);
        } else {
            error.router.internalError(res)(err);
        }
    });
});

module.exports = signups;