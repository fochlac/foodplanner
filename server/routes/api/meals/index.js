const   meals           = require('express').Router()
    ,   mealsDB         = require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   signupsDB       = require(process.env.FOOD_HOME + 'modules/db/signups')
    ,   paymentDB       = require(process.env.FOOD_HOME + 'modules/db/payment')
    ,   image           = require(process.env.FOOD_HOME + 'middleware/singleImage')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error')
    ,   scheduler       = require(process.env.FOOD_HOME + 'modules/scheduler')
    ,   mail            = require(process.env.FOOD_HOME + 'modules/mailer')
    ,   caches          = require(process.env.FOOD_HOME + 'modules/cache')
    ,   jwt             = require(process.env.FOOD_HOME + 'modules/auth/jwt')
    ,   notification    = require(process.env.FOOD_HOME + 'modules/notification')
    ,   fs              = require('fs')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log');

let cache = caches.getCache('meals'),
    signupCache = caches.getCache('signups'),
    updateCache = caches.getCache('update');

meals.post('/:id/lock', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), error.router.validate('body', {
    prices: 'array'
}), (req, res) => {
    let errorElem,
        valid = !req.body.prices.some((price) => {
            if (!(
                ['meals', 'mealOptions', 'mealOptionValues'].includes(price.db)
                && /^[0-9]{1,9}$/.test(price.id)
                && /^[0-9.]{0,9}$/.test(price.price)
            )) {
                errorElem = price;
                return true;
            }
            return false;
        });

    if (!valid) {
        log(4, 'PriceArray not valid.');
        return res.status(400).send({msg: 'Options not valid.', type: 'Invalid_Request', data: [JSON.stringify(errorElem)]});
    }
    cache.delete(req.params.id);
    cache.delete('allMeals');
    signupCache.deleteAll();
    updateCache.deleteAll();

    mealsDB.getMealById(req.params.id)
        .then(meal => {
            if (meal.creatorId == req.user.id) {
                return paymentDB.setPrices(req.body.prices);
            } else {
                log(4, `User ${req.user.id} tried to lock meal ${req.params.id} without being the creator.`);
                return Promise.reject({status: 403, type: 'FORBIDDEN'});
            }
        })
        .then(() => paymentDB.lockMealPrices(req.params.id))
        .then(() => paymentDB.getEligibleSignups(req.params.id))
        .then((eligibleSignups) => Promise.all(
            eligibleSignups.map(
                signup => paymentDB.payForSignup(signup.id)
                    .then(res => Promise.resolve({error: false, data: res}),
                        err => Promise.resolve({error: true, data: err})
                    )
            )
        ))
        .then(results => log(6, results.filter(res => res.error).length + ' payments of ' + results.length + ' possible payments failed.'))
        .then(() => paymentDB.getPricesByMeal(req.params.id))
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error.router.internalError(res));
});

meals.post('/:id/prices', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), error.router.validate('body', {
    prices: 'array'
}), (req, res) => {
    let errorElem,
        valid = !req.body.prices.some((price) => {
            if (!(
                ['meals', 'mealOptions', 'mealOptionValues'].includes(price.db)
                && /^[0-9]{1,9}$/.test(price.id)
                && /^[0-9.]{0,9}$/.test(price.price)
            )) {
                errorElem = price;
                return true;
            }
            return false;
        });

    if (!valid) {
        log(4, 'PriceArray not valid.');
        return res.status(400).send({msg: 'Options not valid.', type: 'Invalid_Request', data: [JSON.stringify(errorElem)]});
    }

    cache.delete(req.params.id);
    cache.delete('allMeals');
    updateCache.deleteAll();

    mealsDB.getMealById(req.params.id)
        .then(meal => {
            if (meal.creatorId == req.user.id) {
                return paymentDB.setPrices(req.body.prices);
            } else {
                log(4, `User ${req.user.id} tried to set prices for meal ${req.params.id} without being the creator.`);
                return Promise.reject({status: 403, type: 'FORBIDDEN'});
            }
        })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error.router.internalError(res));
});

meals.get('/', (req, res) => {
    let meal = cache.get('allMeals');
    if (meal) {
        res.status(200).send(meal);
    } else {
        mealsDB.getAllMeals().then((meals) => {
            cache.put('allMeals', meals);
            res.status(200).send(meals);
        })
        .catch(error.router.internalError(res));
    }
});

meals.put('/:id', image.single('imageData'), jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    description: /^[^"%;]*$/,
    time: /^[0-9]{1,15}$/,
    deadline: /^[0-9]{0,15}$/,
    signupLimit: /^[0-9]{0,9}$/,
    options: 'jsonString'
}), (req, res) => {
    let mealData = Object.assign({}, req.body, {options: JSON.parse(req.body.options)});

    optionsInvalid = mealData.options.some(option => {
        if (!/^[^"%;]{1,150}$/.test(option.name)) {
            return true;
        } else if (
            option.type !== 'toggle'
            && (
                !option.values
                || !option.values.length
                || !option.values.every(value => /^[^"%;]{1,150}$/.test(value))
            )
        ) {
            return true;
        }

        return false;
    });

    if (optionsInvalid) {
        log(4, 'Options not valid.');
        return res.status(400).send({msg: 'Options not valid.', type: 'Invalid_Request', data: ['options']});
    }

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', req.params.id, '.' + splitfile[splitfile.length - 1]].join('');
    } else {
        delete mealData.image;
    }

    cache.delete(req.params.id);
    cache.delete('allMeals');
    updateCache.deleteAll();

    mealsDB.getMealById(req.params.id)
    .then(meal => {
        if (meal.creatorId == req.user.id) {
            return mealsDB.setMealById(req.params.id, mealData);
        } else {
            log(4, `User ${req.user.id} tried to update meal ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then(id => mealsDB.getMealById(id))
    .then((meal) => {
        scheduler.rescheduleMeal(meal);
        if (req.file) {
            fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function (err, files) {
                if (err) {
                    log(5, 'Cant find image for product ' + req.params.id, err);
                }
                let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find((file) => (-1 !== file.indexOf('meal_' + req.params.id)));
                fs.unlink(path,(err) => {
                    if (err) {
                        log(2, 'Cant find image for product ' + req.params.id, err);
                    }
                    fs.rename(req.file.path, req.file.destination + mealData.image, (err) => {
                        error.checkError(3, 'failed renaming ' + req.file.path)(err);
                        res.status(200).send(meal);
                    });
                });
            });
        } else {
            res.status(200).send(meal);
        }
    })
    .catch(error.router.internalError(res));
});

meals.delete('/:id', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {

    cache.delete(req.params.id);
    cache.delete('allMeals');
    signupCache.deleteAll();
    updateCache.deleteAll();

    mealsDB.getMealById(req.params.id)
    .then(meal => {
        if (meal.creatorId == req.user.id) {
            return mealsDB.deleteMealById(req.params.id);
        } else {
            log(4, `User ${req.user.id} tried to delete meal ${req.params.id} without being the creator.`);
            return Promise.reject({status: 403, type: 'FORBIDDEN'});
        }
    })
    .then(() => signupsDB.deleteSignupsByMeal(req.params.id))
    .then((data) => {
        scheduler.cancelMeal(req.params.id);

        fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function (err, files) {
            if (err) {
                log(2, 'Cant find image for product ' + req.params.id, err);
                return res.status(200).send({});
            }
            let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find((file) => (-1 !== file.indexOf('meal_' + req.params.id)));
            fs.unlink(path,
            (err) => {
                if (err) {
                    log(2, 'Cant find image for product ' + req.params.id, err);
                }
                res.status(200).send({});
            });
        });
    })
    .catch(error.router.internalError(res));
});

meals.post('/', image.single('imageData'), jwt.requireAuthentication, error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    creator: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,70}$/,
    description: /^[^"%;]*$/,
    time: /^[0-9]{1,50}$/,
    deadline: /^[0-9]{0,50}$/,
    signupLimit: /^[0-9]{0,50}$/,
    options: 'jsonString'
}), (req, res) => {
    let mealData = Object.assign({}, req.body, {options: JSON.parse(req.body.options)});

    optionsInvalid = mealData.options.some(option => {
        if (!/^[^"%;]{1,150}$/.test(option.name)) {
            return true;
        } else if (
            option.type !== 'toggle'
            && (
                !option.values
                || !option.values.length
                || !option.values.every(value => /^[^"%;]{1,150}$/.test(value))
            )
        ) {
            return true;
        }

        return false;
    });

    if (optionsInvalid) {
        log(4, 'Options not valid.');
        return res.status(400).send({msg: 'Options not valid.', type: 'Invalid_Request', data: ['options']});
    }
    log(6, 'Options valid');

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', splitfile[splitfile.length - 1]];
    } else {
        delete mealData.image;
    }

    mealsDB.createMeal(mealData)
        .then(id => mealsDB.getMealById(id))
        .then(meal => {
            cache.delete('allMeals');
            updateCache.deleteAll();
            mail.sendCreationNotice(meal);
            scheduler.scheduleMeal(meal);
            notification.sendCreationNotice(meal);

            if (req.file) {
                let imageName = meal.image.split('/');
                fs.rename(req.file.path, req.file.destination + imageName[imageName.length - 1], (err) => {
                    error.checkError(3, 'failed renaming ' + req.file.path)(err);
                    res.status(200).send(meal);
                });
            } else {
                res.status(200).send(meal);
            }
        })
        .catch(error.router.internalError(res));
});


meals.post('/:id/mail', jwt.requireAdmin, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    mealsDB.getMealById(req.params.id).then((meals) => {
        mail.sendCreationNotice(meal);
        res.status(200).send(meals);
    })
    .catch(error.router.internalError(res));
});

module.exports = meals;