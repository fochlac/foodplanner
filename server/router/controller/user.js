const user = require('express').Router()
  , userDB = require(process.env.FOOD_HOME + 'modules/db/user')
  , paymentDB = require(process.env.FOOD_HOME + 'modules/db/payment')
  , error = require(process.env.FOOD_HOME + 'modules/error')
  , log = require(process.env.FOOD_HOME + 'modules/log')
  , jwt = require(process.env.FOOD_HOME + 'modules/auth/jwt')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , mailer = require(process.env.FOOD_HOME + 'modules/mailer')
  , crypto = require(process.env.FOOD_HOME + 'modules/crypto')

  , cookieOptions = { secure: true, httpOnly: true, expires: new Date(Date.now() + 1000 * 3600 * 24 * 365) };


let cache = caches.getCache('users'),
  mailCache = caches.getCache('mail'),
  userListCache = caches.getCache('userList');


const handleGetUserById = (id, res) => {
  const user = cache.get('user_' + id);
  if (user) {
    res.cookie('jwt', user.token, cookieOptions);
    res.status(200).send(user);
  } else {
    userDB.getUserByProperty('id', id).then((result) => {
      log(6, 'got user data');
      if (!result) {
        return res.status(200).send({});
      }
      return jwt.createToken(result).then(token => {
        res.cookie('jwt', token, cookieOptions);
        cache.put('user_' + id, result ? result : undefined);
        res.status(200).send(result);
      });
    })
    .catch(error.router.internalError(res));
  }
}

module.exports = {
  createUser: async (req, res) => {
    crypto.createUserHash(req.body.hash)
      .then(({ hash, salt }) => userDB.createUser(req.body, hash, salt))
      .then((user) => {
        mailCache.deleteAll();
        userListCache.deleteAll();
        return jwt.createToken(user).then(token => {
          res.cookie('jwt', token, cookieOptions);
          res.status(200).send(user);
        });
      })
      .catch(error.router.internalError(res));
  },

  editUser: (req, res) => {
    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s settings`);
      return res.status(403).send({ type: 'FORBIDDEN' });
    }

    cache.delete('user_' + req.params.id);
    mailCache.deleteAll();
    userListCache.deleteAll();
    userDB.setUserByProperty('id', req.params.id, req.body).then((mail) => {
      res.status(200).send(mail);
    })
      .catch(error.router.internalError(res));
  },

  getUser: (req, res) => {
    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s user data`);
      return res.status(403).send({ type: 'FORBIDDEN' });
    }

    handleGetUserById(req.user.id, res);
  },


  login: (req, res) => {
    crypto.verifyUser(req.body)
      .then(id => {
        handleGetUserById(id, res);
      })
      .catch(error.router.internalError(res));
  },

  sendMoney: (req, res) => {
    if (+req.body.source !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.body.source}'s money`);
      return res.status(403).send({ type: 'FORBIDDEN' });
    }

    cache.delete('user_' + req.params.id);
    cache.delete('history_' + req.params.id);
    cache.delete('user_' + req.body.source);
    cache.delete('history_' + req.body.source);
    userListCache.deleteAll();
    paymentDB.sendMoney(req.body.source, req.params.id, req.body.amount).then(() => {
      res.status(200).send({ success: true });
    })
      .catch(error.router.internalError(res));
  },

  transactions: (req, res) => {
    let history = cache.get('history_' + req.params.id);

    if (+req.params.id !== +req.user.id) {
      log(4, `User ${req.user.id} tried to access user ${req.params.id}'s history`);
      return res.status(403).send({ type: 'FORBIDDEN' });
    }

    if (history) {
      res.status(200).send(history);
    } else {
      paymentDB.getHistoryByUserId(req.params.id).then((result) => {
        cache.put('history_' + req.params.id, result);
        res.status(200).send(result);
      })
        .catch(error.router.internalError(res));
    }
  },
}
