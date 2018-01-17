const	log		= require(process.env.FOOD_HOME + 'modules/log');


module.exports = {
	default: log,

	promise: (level, message) => {
		return (err) => {
			log(level, message, err);
		}
	},

	checkError: (level, message) => {
		return (err) => {
			if (err) {
				log(level, message, err);
			}
		}
	},

	db: {
		codeError: (...err) => {
			log(1, ...err);
			return Promise.reject();
		},
		queryError: (level, db, message) => {
			return (err) => {
				db.release();
				log(level, message, err);
			}
		}
	},

	router: {
		authError: (res, ip) => {
				log(2, 'Invalid Auth Hash from IP: ' + ip);
				log(10, 'Invalid Auth Hash: ', res);

				res.status(401).send({success: false, type: 'Authentication_Error'});
		},

		internalError: (res) => {
			return (err) => {
		        if (err.status) {
		            res.status(err.status).send(err);
		        } else {
					log(2, 'Internal Error: ', err);
					log(10, 'Internal Error: ', res);

					res.status(500).send({success: false, type: 'Internal_Error'});
		        }
			}
		},

		validate: (type, options) => {
			return (req, res, next) => {
				let param,
					valid = true,
					payload = req[type],
					invalidParams = [];

				for (param in options) {
					if (typeof options[param] !== 'string' && !options[param].test(payload[param])) {
						valid = false;
						invalidParams.push(param);
					} else if (options[param] === 'object' && typeof payload[param] !== 'object') {
						valid = false;
						invalidParams.push(param);
					} else if (options[param] === 'array' && !Array.isArray(payload[param])) {
						valid = false;
						invalidParams.push(param);
					} else if (options[param] === 'jsonString') {
						try {
							JSON.parse(payload[param]);
						}
						catch(err) {
							valid = false;
							invalidParams.push(param);
						}
					}
					log(6, `Validating ${param}: '${payload[param]}' against RegExp ${options[param]}, result ${(typeof options[param] === 'string') ? valid : options[param].test(payload[param])}`);
				}
				if (valid) {
					next();
				} else {
					log(4, 'Invalid Request.', payload);
					res.status(400).send({type: 'Invalid_Request', data: invalidParams});
				}
			}
		}
	}
};