const userDB = require(process.env.FOOD_HOME + 'modules/db/user')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , log = require(process.env.FOOD_HOME + 'modules/log')
  , crypto = require('crypto')
  , uuid = require('uuid')
  , conf = {
    iterations: 20000,
    hashBytes: 32,
    digest: 'sha512'
  };


let cache = caches.getCache('userAuth');


function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, salt) => {
      if (err) {
        return reject(err);
      }
      resolve(salt.toString('base64'));
    });
  });
}

function generateHash(value, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(value, salt, conf.iterations, conf.hashBytes, conf.digest, (err, hash) => {
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

  verifyUser: async({hash, mail}) => {
    let user = cache.get(mail);

    if (!user) {
      user = await userDB.getUserAuthByMail(mail);
      cache.put(mail, user);
    }
    return generateHash(hash, user.salt)
      .then(newHash => user.hash === newHash.hash
        ? Promise.resolve(user.id)
        : Promise.reject({ status: 403, type: 'BAD_PASSWORD' })
      );
  },
}
