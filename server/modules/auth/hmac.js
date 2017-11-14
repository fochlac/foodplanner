const crypto = require('crypto');

module.exports = (secret, hashfield) => {

    return (req, res, next) => {
        if (req.body) {
            let hash = 'sha1=' + crypto.createHmac('SHA1', secret).update(JSON.stringify(req.body)).digest('hex');

            if (req.get(hashfield) === hash) {
                next();
            } else {
                res.status(403).send();
            }
        } else {
            res.status(403).send();
        }
    };
};