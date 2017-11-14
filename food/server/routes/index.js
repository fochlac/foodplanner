const 	routes 		= require('express').Router()
	,	api 		= require('./api');

routes.use('/api',  api);

module.exports = routes;