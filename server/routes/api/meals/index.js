const   meals           = require('express').Router()
    ,   mealsDB         = require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   paymentDB       = require(process.env.FOOD_HOME + 'modules/db/payment')
    ,   image           = require(process.env.FOOD_HOME + 'middleware/singleImage')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error')
    ,   scheduler       = require(process.env.FOOD_HOME + 'modules/scheduler')
    ,   mail            = require(process.env.FOOD_HOME + 'modules/mailer')
    ,   notification    = require(process.env.FOOD_HOME + 'modules/notification')
    ,   fs              = require('fs')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log');


meals.get('/:id/payment', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    paymentDB.getEligibleSignups(req.params.id)
        .then((eligibleSignups) => Promise.all(
            eligibleSignups.map(
                result => paymentDB.payForSignup(result.id)
                    .then(res => Promise.resolve({error: false, data: res}),
                        err => Promise.resolve({error: true, data: err})
                    )
            )
        ))
        .then(results => log(6, results.filter(res => !res.error).length + ' payments of ' + results.length + ' failed.'))
        .then(() => paymentDB.getPricesByMeal(req.params.id))
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error.router.internalError(res));
});

meals.post('/prices', error.router.validate('body', {
    prices: 'array'
}), (req, res) => {
    let errorElem,
        valid = !req.body.prices.some((price) => {
            if (!(
                ['meals', 'mealOptions', 'mealOptionValues'].includes(price.db)
                && /^[0-9]*$/.test(price.id)
                && /^[0-9.]*$/.test(price.price)
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

    paymentDB.setPrices(req.body.prices)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error.router.internalError(res));
});

meals.get('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    mealsDB.getMealById(req.params.id).then((meals) => {
        res.status(200).send(meals);
    })
    .catch(error.router.internalError(res));
});

meals.get('/', (req, res) => {
    mealsDB.getAllMeals().then((meals) => {
        res.status(200).send(meals);
    })
    .catch(error.router.internalError(res));
});

meals.put('/:id', image.single('imageData'), error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
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

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', req.params.id, '.' + splitfile[splitfile.length - 1]].join('');
    } else {
        delete mealData.image;
    }

    mealsDB.setMealById(req.params.id, mealData).then((meal) => {
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

meals.delete('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    mealsDB.deleteMealById(req.params.id).then((data) => {
        scheduler.cancelMeal(req.params.id);

        fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function (err, files) {
            if (err) {
                log(2, 'Cant find image for product ' + req.params.id, err);
                return res.status(200).send(data);
            }
            let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find((file) => (-1 !== file.indexOf('meal_' + req.params.id)));
            fs.unlink(path,
            (err) => {
                if (err) {
                    log(2, 'Cant find image for product ' + req.params.id, err);
                }
                res.status(200).send(data);
            });
        });
    })
    .catch(error.router.internalError(res));
});

meals.post('/', image.single('imageData'), error.router.validate('body', {
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

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', splitfile[splitfile.length - 1]];
    } else {
        delete mealData.image;
    }

    mealsDB.createMeal(mealData).then((meal) => {
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


meals.post('/:id/mail', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    mealsDB.getMealById(req.params.id).then((meals) => {
        mail.sendCreationNotice(meal);
        res.status(200).send(meals);
    })
    .catch(error.router.internalError(res));
});

module.exports = meals;