const 	routes 		    = require('express').Router()
    ,   signups         = require('./signups')
    ,   meals           = require('./meals')
    ,   notification    = require('./notification')
    ,   mail            = require('./mail')
    ,   user         	= require('./user')
	,	github 		    = require('./github')

    ,   error           = require(process.env.FOOD_HOME + 'modules/error')
    ,   mealsDB         = require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   signupsDB       = require(process.env.FOOD_HOME + 'modules/db/signups')
    ,   caches         	= require(process.env.FOOD_HOME + 'modules/cache');

let updateCache = caches.getCache('update');

routes.use('/github', github);

routes.get('/update', error.router.validate('query', {
    version: /^[0-9]{0,100}$/
}), (req, res) => {
	if (caches.getVersion() > +req.query.version)  {
		if (updateCache.get('update')) {
			res.status(200).send(updateCache.get('update'));
		} else {
			Promise.all([mealsDB.getAllMeals(), signupsDB.getAllSignups()])
			.then(data => {
				let response = {
						signups: data[1],
						meals: data[0],
						version: caches.getVersion()
					};

				updateCache.put('update', response);
				res.status(200).send(response);
			})
			.catch(error.router.internalError(res));
		}
	} else {
		res.status(200).send({});
	}
});

routes.use('/signups', signups);
routes.use('/meals', meals);
routes.use('/user', user);
routes.use('/mail', mail);
routes.use('/notification', notification);

module.exports = routes;