const	log		= require(process.env.FOOD_HOME + 'modules/log');


module.exports = {
	default: log,

	promise: (level, message) => {
		return (err) => {
			log(level, message, err);
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
					log(6, `Validating ${param}: '${payload[param]}' against RegExp ${options[param]}, result ${options[param].test(payload[param])}`);
					if (valid && !options[param].test(payload[param])) {
						valid = false;
					}
				}

				if (valid) {
					next();
				} else {
					log(4, 'Invalid Request.', payload);
					res.status(400).send();
				}
			}
		}
	}
};