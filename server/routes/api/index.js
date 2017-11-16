const 	routes 		    = require('express').Router()
    ,   signups         = require('./signups')
    ,   meals           = require('./meals')
    ,   mail         	= require('./mail')
	,	github 		    = require('./github');

routes.use('/github', github);

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

routes.use('/signups', signups);
routes.use('/meals', meals);
routes.use('/mail', mail);

module.exports = routes;