const	meals	    = require('express').Router()
    ,   mealsDB     = require(process.env.FOOD_HOME + 'modules/db/meals')
	,	image 	    = require(process.env.FOOD_HOME + 'middleware/singleImage')
	,	error 		= require(process.env.FOOD_HOME + 'modules/error')
    ,   fs          = require('fs')
    ,   log         = require(process.env.FOOD_HOME + 'modules/log');


meals.get('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    mealsDB.getMealByProperty('id', req.params.id).then((meals) => {
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
    signupLimit: /^[0-9]{0,50}$/
}), (req, res) => {
    let mealData = Object.assign({}, req.body);

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', req.params.id, '.' + splitfile[splitfile.length - 1]].join('');
    } else {
        delete mealData.image;
    }

    mealsDB.setMealByProperty('id', req.params.id, mealData).then((meal) => {
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
    mealsDB.deleteMealByProperty('id', req.params.id).then((data) => {
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
                    return res.status(200).send(data);
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
    signupLimit: /^[0-9]{0,50}$/
}), (req, res, next) => {
    let mealData = Object.assign({}, req.body);

    if (req.file) {
        let splitfile = req.file.filename.split('.');

        mealData.image = ['meal_', splitfile[splitfile.length - 1]];
    } else {
        delete mealData.image;
    }

    mealsDB.createMeal(mealData).then((meal) => {
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

module.exports = meals;