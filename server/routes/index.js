const 	routes 		= require('express').Router()
    ,   api         = require('./api')
    ,   timestamp   = require(process.env.FOOD_HOME + 'middleware/timestamp')
    ,   logger      = require(process.env.FOOD_HOME + 'middleware/logger')
	,	unsubscribe = require('./unsubscribe');


routes.use('/api', timestamp, logger, api);
routes.use('/unsubscribe', unsubscribe);

module.exports = routes;