const 	routes 		= require('express').Router()
    ,   api         = require('./api')
    ,   timestamp   = require(process.env.FOOD_HOME + 'middleware/timestamp')
	,	unsubscribe = require('./unsubscribe');


routes.use('/api', timestamp, api);
routes.use('/unsubscribe', unsubscribe);

module.exports = routes;