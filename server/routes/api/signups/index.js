const	signups	    = require('express').Router()
    ,   signupsDB   = require(process.env.FOOD_HOME + 'modules/db/signups')
    ,   paymentDB   = require(process.env.FOOD_HOME + 'modules/db/payment')
	,	mealsDB 	= require(process.env.FOOD_HOME + 'modules/db/meals')
	,	error 		= require(process.env.FOOD_HOME + 'modules/error')
    ,   jwt             = require(process.env.FOOD_HOME + 'modules/auth/jwt')
    ,   caches       = require(process.env.FOOD_HOME + 'modules/cache')
    ,   log         = require(process.env.FOOD_HOME + 'modules/log');

let cache = caches.getCache('signups');

signups.post('/:id/paid', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    cache.delete(req.params.id);
    cache.delete('allSignups');

    mealsDB.getMealCreatorBySignupId(req.params.id)
    .then(id => {
        if (id == req.user.id) {
            return signupsDB.setSignupPaymentStatusById(req.params.id, true);
        } else {
            log(4, `User ${req.user.id} tried to update signup ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then((signup) => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

signups.delete('/:id/paid', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    cache.delete(req.params.id);
    cache.delete('allSignups');

    mealsDB.getMealCreatorBySignupId(req.params.id)
    .then(id => {
        if (id == req.user.id) {
            return signupsDB.setSignupPaymentStatusById(req.params.id, false);
        } else {
            log(4, `User ${req.user.id} tried to update signup ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then((signup) => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

signups.get('/', (req, res) => {
    let signup = cache.get('allSignups');
    if (signup) {
        res.status(200).send(signup);
    } else {
        signupsDB.getAllSignups().then((signups) => {
            cache.put('allSignups', signups);
            res.status(200).send(signups);
        })
        .catch(error.router.internalError(res));
    }
});

signups.put('/:id', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), error.router.validate('body', {
    comment: /^[^"%;]{0,150}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/
}), (req, res) => {
    mealsDB.getMealById(req.body.meal)
    .then(meal => {
        const optionsInvalid = meal.options.some(option => {
            const mealOption = req.body.options.find(mealOpt => mealOpt.id === option.id);

            if (!mealOption) {
                return true;
            }
            switch(option.type){
                case 'count':
                    if (mealOption.count === undefined) {
                        return true;
                    }
                case 'select':
                    if (mealOption.value === undefined) {
                        return true;
                    }
                    break;
                case 'toggle':
                    if (mealOption.show === undefined) {
                        return true;
                    }
                    break;
            }
            return false;
        });

        if (optionsInvalid) {
            log(5, 'put - /signups/:id', 'invalid Options');
            return Promise.reject({status: 422, type: 'Invalid_Request', data: ['options']});
        }

        cache.delete(req.params.id);
        cache.delete('allSignups');

        return Promise.all([signupsDB.getSignupByProperty('id', req.params.id), mealsDB.getMealCreatorBySignupId(req.params.id)]);
    })
    .then((data) => {
        if (data[0].userId == req.user.id || data[1] == req.user.id) {
            return signupsDB.setSignupById(req.params.id, req.body);
        } else {
            log(4, `User ${req.user.id} tried to update signup ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

signups.delete('/:id', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    cache.delete(req.params.id);
    cache.delete('allSignups');
    Promise.all([signupsDB.getSignupByProperty('id', req.params.id), mealsDB.getMealCreatorBySignupId(req.params.id)])
    .then((data) => {
        if (data[0].userId == req.user.id || data[1] == req.user.id) {
            return signupsDB.deleteSignupById(req.params.id);
        } else {
            log(4, `User ${req.user.id} tried to delete signup ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then(() => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

signups.post('/', error.router.validate('body', {
    comment: /^[^"%;]{0,250}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,9}$/
}), (req, res) => {
    Promise.all([
        mealsDB.getMealById(req.body.meal),
        signupsDB.getSignupsByProperty('meal', req.body.meal)
    ])
    .then(result => {
        const meal = result[0],
            signups = result[1];

        if (result[0].signupLimit && result[0].signupLimit <= result[1].length) {
            log(5, 'post - /signups/', 'tried to sign up for full offer');
            return Promise.reject({status: 409, type: 'Bad_Request', reason: 'offer_full'});
        }

        const optionsInvalid = meal.options.some(option => {
            const mealOption = req.body.options.find(mealOpt => mealOpt.id === option.id);

            if (!mealOption) {
                return true;
            }
            switch(option.type){
                case 'count':
                    if (mealOption.count === undefined) {
                        return true;
                    }
                case 'select':
                    if (mealOption.value === undefined) {
                        return true;
                    }
                    break;
                case 'toggle':
                    if (mealOption.show === undefined) {
                        return true;
                    }
                    break;
            }
            return false;
        });

        if (optionsInvalid) {
            log(5, 'post - /signups/', 'invalid options');
            return Promise.reject({status: 422, type: 'Invalid_Request', data: ['options']});
        }

        cache.delete('allSignups');

        return signupsDB.createSignUp(req.body);
    })
    .then((signup) => signupsDB.getSignupByProperty('id', signup.id))
    .then((signup) => {
        res.status(200).send(signup);
    })
    .catch(error.router.internalError(res));
});

module.exports = signups;