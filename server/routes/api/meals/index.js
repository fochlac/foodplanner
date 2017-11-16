const	meals	    = require('express').Router()
	,	mealsDB 	= require(process.env.FOOD_HOME + 'modules/db/meals')
	,	error 		= require(process.env.FOOD_HOME + 'modules/error');

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

meals.put('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    creator: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,70}$/,
    description: /^[^"%;]*$/,
    time: /^[0-9]{1,50}$/,
    deadline: /^[0-9]{0,50}$/,
    signupLimit: /^[0-9]{0,50}$/,
    image: /^[^"%;]{0,150}$/
}), (req, res) => {
    mealsDB.setMealByProperty('id', req.params.id, req.body).then((meals) => {
        res.status(200).send(meals);
    })
    .catch(error.router.internalError(res));
});

meals.delete('/:id', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => {
    mealsDB.deleteMealByProperty('id', req.params.id).then((data) => {
        res.status(200).send(data);
    })
    .catch(error.router.internalError(res));
});

meals.post('/', error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,70}$/,
    creator: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,70}$/,
    description: /^[^"%;]*$/,
    time: /^[0-9]{1,50}$/,
    deadline: /^[0-9]{0,50}$/,
    signupLimit: /^[0-9]{0,50}$/,
    image: /^[^"%;]{0,150}$/
}), (req, res) => {
    mealsDB.createMeal(req.body).then((meal) => {
        res.status(200).send(meal);
    })
    .catch(error.router.internalError(res));
});

module.exports = meals;