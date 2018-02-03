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
  if (!value || !value.length) {
    return Promise.resolve({});
  }
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
      if (!user) {
        return Promise.reject({ status: 400, type: 'BAD_USER' })
      }
      cache.put(mail, user);
    }
    if (!user.salt || !user.salt.length) {
      return Promise.resolve(user.id);
    }
    return generateHash(hash, user.salt)
      .then(newHash => user.hash === newHash.hash
        ? Promise.resolve(user.id)
        : Promise.reject({ status: 403, type: 'BAD_PASSWORD' })
      );
  },
}
