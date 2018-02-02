const 	routes 		= require('express').Router()
    ,   api         = require('./api')
    ,   timestamp   = require(process.env.FOOD_HOME + 'middleware/timestamp')
    ,   logger      = require(process.env.FOOD_HOME + 'middleware/logger')
    ,   jwt         = require(process.env.FOOD_HOME + 'modules/auth/jwt')
	,	unsubscribe = require('./unsubscribe');

routes.use('/api', timestamp, logger, jwt.checkToken, api);
routes.use('/unsubscribe', unsubscribe);

module.exports = routes;