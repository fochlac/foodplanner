const   crypto      = require('crypto')
    ,   uuid        = require('uuid')
    ,   conf        = {
        iterations: 20000,
        hashBytes: 32,
        digest: 'sha512'
    };

function generateSalt() {
    return new Promise( (resolve, reject) => {
        crypto.randomBytes(16, (err, salt) => {
            if (err) {
              return reject(err);
            }
            resolve(salt.toString('base64'));
        });
    });
}

function generateHash(value, salt) {
    return new Promise( (resolve, reject) => {
        crypto.pbkdf2( value, salt, conf.iterations, conf.hashBytes, conf.digest, (err, hash) => {
            if (err) {
                return reject(err);
            }

            resolve({
                hash: hash.toString('base64'),
                salt
            });
        });
    });
}


module.exports = {
    createUserHash: (password) => {
        return generateSalt()
            .then(salt => generateHash(password, salt));
    },

    verifyUser: (hash) => {
        return (userObj) => {
            return generateHash(hash, userObj.salt)
                .then(newHash => {
                    if (userObj.hash === newHash.hash) {
                        return Promise.resolve(userObj);
                    } else {
                        return Promise.reject({type: 'InvalidHash'});
                    }
                });
        }
    }
}