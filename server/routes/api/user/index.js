const	user	     = require('express').Router()
	,	userDB 	     = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   paymentDB    = require(process.env.FOOD_HOME + 'modules/db/payment')
    ,   error        = require(process.env.FOOD_HOME + 'modules/error')
    ,   log          = require(process.env.FOOD_HOME + 'modules/log')
    ,   jwt          = require(process.env.FOOD_HOME + 'modules/auth/jwt')
    ,   caches       = require(process.env.FOOD_HOME + 'modules/cache')
    ,   mailer       = require(process.env.FOOD_HOME + 'modules/mailer');


let cache = caches.getCache('users'),
    mailCache = caches.getCache('mail'),
    userList = caches.getCache('userList');

user.post('/:id/logout', error.router.validate('params', {
    id: /^[0-9]*$/
}), (req, res) => res.status(200).cookie('jwt', '', {secure: true, httpOnly: true, expires: 0}).send({}));

user.put('/:id/money', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]*$/
}), error.router.validate('body', {
    source: /^[0-9]{1,9}$/,
    amount: /^[0-9]{1,6}[.0-9]{0,3}$/
}), (req, res) => {

    if (+req.params.source !== +req.user.id) {
        log(4, `User ${req.user.id} tried to access user ${req.params.id}'s money`);
        return res.status(403).send({type: 'FORBIDDEN'});
    }

    cache.delete('user_' + req.params.id);
    cache.delete('history_' + req.params.id);
    paymentDB.sendMoney(req.body.source, req.params.id, req.body.amount).then(() => {
        res.status(200).send({success: true});
    })
    .catch(error.router.internalError(res));
});

user.put('/:id', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[1-9]*$/
}), error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {

    if (+req.params.id !== +req.user.id) {
        log(4, `User ${req.user.id} tried to access user ${req.params.id}'s settings`);
        return res.status(403).send({type: 'FORBIDDEN'});
    }

    cache.delete('user_' + req.params.id);
    mailCache.deleteAll();
    userList.deleteAll();
    userDB.setUserByProperty('id', req.params.id, req.body).then((mail) => {
        res.status(200).send(mail);
    })
    .catch(error.router.internalError(res));
});

user.get('/:id/history', jwt.requireAuthentication, error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    let history = cache.get('history_' + req.params.id);

    if (+req.params.id !== +req.user.id) {
        log(4, `User ${req.user.id} tried to access user ${req.params.id}'s history`);
        return res.status(403).send({type: 'FORBIDDEN'});
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
});

user.get('/:id', error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    let user = cache.get('user_' + req.params.id);
    if (user) {
        console.log(user);
        res.cookie('jwt', user.token, {secure: true, httpOnly: true, expires: new Date(Date.now() + 1000 * 3600 * 24 * 365)});
        res.status(200).send(user);
    } else {
        userDB.getUserByProperty('id', req.params.id).then((result) => {
            log(6, 'got user data');
            if (!result) {
                return res.status(200).send({});
            }

            return jwt.createToken(result).then(token => {
                result.token = token;
                res.cookie('jwt', token, {secure: true, httpOnly: true, expires: new Date(Date.now() + 1000 * 3600 * 24 * 365)});
                cache.put('user_' + req.params.id, result ? result : undefined);
                res.status(200).send(result);
            });
        })
        .catch(error.router.internalError(res));
    }
});

user.post('/', error.router.validate('body', {
    name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
    mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
    deadlineReminder: /^(0|1)$/,
    creationNotice: /^(0|1)$/
}), (req, res) => {
    mailCache.deleteAll();
    userList.deleteAll();
    userDB.createUser(req.body).then((user) => {
        return jwt.createToken(user).then(token => {
                res.cookie('jwt', token, {secure: true, httpOnly: true, expires: new Date(Date.now() + 1000 * 3600 * 24 * 365)});
                res.status(200).send(user);
            });
    })
    .catch(error.router.internalError(res));
});

module.exports = user;