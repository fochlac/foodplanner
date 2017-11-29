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
    meal: /^[0-9]{1,50}$/
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
            return Promise.reject({type: 2, msg: 'Options not valid.', type: 'Invalid_Request', data: ['options']});
        }

        return signupsDB.setSignupById(req.params.id, req.body);
    })
    .then((signup) => {
        res.status(200).send(signup);
    })
    .catch(err => {
        if ([1, 2].includes(err.type)) {
            log(4, err.msg)
            res.status(400).send(err);
        } else {
            error.router.internalError(res)(err);
        }
    });
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
    comment: /^[^"%;]{0,250}$/,
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,50}$/,
    meal: /^[0-9]{1,50}$/
}), (req, res) => {
    Promise.all([
        mealsDB.getMealById(req.body.meal),
        signupsDB.getSignupsByProperty('meal', req.body.meal)
    ])
    .then(result => {
        const meal = result[0],
            signups = result[1];

        if (result[0].signupLimit && result[0].signupLimit <= result[1].length) {
            return Promise.reject({id: 1, msg: 'Bad_Request', reason: 'offer_full'});
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
            return Promise.reject({id: 2, msg: 'Options not valid.', type: 'Invalid_Request', data: ['options']});
        }


        return signupsDB.createSignUp(req.body);
    })
    .then((signup) => {
        res.status(200).send(signup);
    })
    .catch(err => {
        if ([1, 2].includes(err.id)) {
            log(4, err.msg)
            res.status(400).send(err);
        } else {
            error.router.internalError(res)(err);
        }
    });
});

module.exports = signups;