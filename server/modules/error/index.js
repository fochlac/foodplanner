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
		}
	},

	router: {
		authError: (res, ip) => {
				log(2, 'Invalid Auth Hash from IP: ' + ip);
				log(10, 'Invalid Auth Hash: ', res);

				res.status(401).send({success: false, error: 'Authentication_Error'})
		},

		internalError: (res) => {
			return (err) => {
				log(2, 'Internal Error: ', err);
				log(10, 'Internal Error: ', res);

				res.status(500).send({success: false, error: 'Internal_Error'})
			}
		},

		validate: (type, options) => {
			return (req, res, next) => {
				let param,
					valid = true,
					payload = req[type];

				for (param in options) {
					if (valid && typeof options[param] !== 'string' && !options[param].test(payload[param])) {
						valid = false;
					} else if (valid && options[param] === 'object' && typeof payload[param] !== 'object') {
						valid = false;
					} else if (valid && options[param] === 'jsonString') {
						try {
							JSON.parse(payload[param])
						}
						catch(err) {
							valid = false;
						}
					}
					log(6, `Validating ${param}: '${payload[param]}' against RegExp ${options[param]}, result ${(typeof options[param] === 'string') ? valid : options[param].test(payload[param])}`);
				}

				if (valid) {
					next();
				} else {
					log(4, 'Invalid Request.', payload);
					res.status(400).send({msg: 'Invalid Request.'});
				}
			}
		}
	}
};