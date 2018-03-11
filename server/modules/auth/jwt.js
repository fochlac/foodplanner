const userDB = require(process.env.FOOD_HOME + 'modules/db/user')
  , jwt = require('jsonwebtoken')
  , error = require(process.env.FOOD_HOME + 'modules/error')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , log = require(process.env.FOOD_HOME + 'modules/log');

const secretKey = process.env.FOOD_UUID
  , jwtOptions = {
    issuer: process.env.FOOD_EXTERNAL
  };

let userList,
  userMap,
  cache = caches.getCache('userList');

function getUserList() {
  let UL = cache.get('userList');
  if (UL) {
    userList = UL.UL;
    userMap = UL.ULMap;
    return Promise.resolve(UL);
  } else {
    return userDB.getAllUsers()
      .then((UL) => {
        userList = UL;
        userMap = UL.reduce((acc, user) => Object.assign(acc, { [`${user.id}_${user.instance}`]: user }), {});
        cache.put('userList', { UL, ULMap: userMap });
        return UL;
      });
  }
}

function createJWT(userObject) {
  return new Promise((resolve, reject) => {
    log(6, 'createJWT: Creating JWT for User: ', userObject.name);
    jwt.sign({ id: userObject.id, admin: userObject.admin, instance: userObject.instance }, secretKey, jwtOptions, (err, token) => {
      if (err) {
        log(5, 'createJWT: Error creating JWT.', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function jwtVerify(request) {
  return new Promise((resolve, reject) => {
    if ((!request.cookies || request.cookies.jwt === undefined) && request.headers.cookie.indexOf('jwt=') === -1) {
      log(5, 'jwtVerify: Call without JWT');
      reject('no token provided');
      return;
    }
    let cookie = {},
      token;

    if (request.headers.cookie) {
      request.headers.cookie.split('; ').forEach(str => {
        cookie[str.split('=')[0]] = str.split('=')[1];
      });
    }
    token = request.headers.jwt || cookie.jwt;

    log(7, 'jwtVerify: decoding JWT-Token');
    jwt.verify(token, secretKey, (err, token) => {
      if (err) {
        log(5, 'jwtVerify: No valid Token provided.', err);
        reject(err);
      } else {
        log(7, 'jwtVerify: JWT-Token is valid');
        resolve(token);
      }
    });
  });
}

function jwtGetUser(token) {
  log(7, 'jwtGetUser: Checking userlist for ' + token.id);

  return getUserList()
    .then(() => new Promise((resolve, reject) => {
      let userObject = userMap[`${token.id.toString()}_${token.instance.toString()}`];

      if (userObject) {
        log(7, 'jwtGetUser: got user');
        resolve(userObject);
      } else {
        log(5, 'jwtGetUser: user not found. Token: ' + JSON.stringify(token) + '. List: ' + JSON.stringify(userMap));
        reject();
      }
    }));
}

module.exports = {
  createToken: (userObject) => {
    return createJWT(userObject);
  },

  checkToken: (req, res, next) => {
    jwtVerify(req)
      .then(jwtGetUser)
      .then((userObject) => {
        req.auth = true;
        req.user = userObject;
        next();
      })
      .catch(err => {
        req.auth = false;
        req.user = undefined;
        next();
      })
  },

  requireAdmin: () => {
    return (req, res, next) => {
      if (req.user.admin) {
        next();
      } else {
        log(4, `User ${req.user.id} from instance ${req.user.instance} tried to access call restricted to role "admin"`);
        res.status(403).send({ type: 'FORBIDDEN' });
      }
    }
  },

  requireAuthentication: (req, res, next) => {
    if (req.auth) {
      next();
    } else {
      log(4, `Anonymous user tried to access restricted call.`);
      res.status(401).send({ type: 'UNAUTHORIZED' });
    }
  },

  clear: (req, res) => res.status(200).cookie('jwt', '', { secure: process.env.DEVELOP ? false : true, httpOnly: true, expires: 0 }).send({})
}
