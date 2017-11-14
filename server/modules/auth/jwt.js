const   userDB  = require(process.env.FOOD_HOME  + 'modules/db/user')
    ,   uuid    = require('uuid')
    ,   jwt     = require('jsonwebtoken')
    ,   error   = require(process.env.FOOD_HOME + 'modules/error')
    ,   log     = require(process.env.FOOD_HOME + 'modules/log');

const   secretKey = uuid.v4()
    ,   jwtOptions = {
            issuer: 'food.fochlac.com'
        };

let userList;

function getUserList() {
    userDB.getAllUserSettings()
    .then((ULResp) => {
        userList = ULResp;
        return ULResp;
    });
}

function createJWT(userObject) {
    return new Promise( (resolve, reject) => {
        log(6, 'createJWT: Creating JWT for User: ', userObject.name);
        jwt.sign({id: userObject.id, role: userObject.role}, secretKey, jwtOptions, (err, token) => {
            if (err) {
                log(4, 'createJWT: Error creating JWT.' , err);
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function jwtVerify(request) {
    return new Promise( (resolve, reject) => {
        if (request.headers.jwt === undefined && request.headers.cookie.indexOf('jwt=') === -1) {
            log(4, 'jwtVerify: Call without JWT');
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

        log(6, 'jwtVerify: decoding JWT-Token');
        jwt.verify(token, secretKey, (err, token) => {
            if (err) {
                log(4, 'jwtVerify: No valid Token provided.', err);
                reject(err);
            } else {
                log(6, 'jwtVerify: JWT-Token is valid');
                resolve(token);
            }
        });
    });
}

function jwtGetUser(token, retest) {
    log(6, 'jwtGetUser: Checking userlist for ' + token.id);
    return new Promise( (resolve, reject) => {
        let userObject = userList.filter((dbUser) => {
                return dbUser.id === token.id;
            });

        if (userObject.length > 0) {
            log(6, 'jwtGetUser: got user');
            resolve(userObject[0]);
        } else {
            log(6, 'jwtGetUser: user not found. Token: ' + JSON.stringify(token) + '. List: ' + JSON.stringify(userList));
            if (retest === true) {
                log(6, 'jwtGetUser: refetched user list, didnt find user in refreshed list.');
                return reject();
            }

            log(6, 'jwtGetUser: refreshing user list.');
            return getUserList()
                .then(() => {
                    return jwtGetUser(token, true);
                });
        }
    });
}

function promiseErrorAuth(err) {
    res.status(500).send();
}

getUserList();


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
            next();
        })
    },

    requireRole:(role) => {
        if (typeof role === 'string') {
            role = [role];
        }

        return (req, res, next) => {
            if (role.contains(req.user.role)) {
                next();
            } else {
                log(4, `User ${req.user.id} tried to access call restricted to role "${role}"`);
                res.status(403).send();
            }
        }
    },

    requireAuthentication: (req, res, next) => {
        if (req.auth) {
            next();
        } else {
            log(4, `Anonymous user tried to access restricted call.`);
            res.status(401).send();
        }
    }
}