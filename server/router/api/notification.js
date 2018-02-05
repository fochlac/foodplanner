const   notification         = require('express').Router()
    ,   notificationDB       = require(process.env.FOOD_HOME + 'modules/db/notification')
    ,   error        = require(process.env.FOOD_HOME + 'modules/error');


notification.delete('/:id', error.router.validate('params', {
    id: /^[0-9]{1,9}$/
}), (req, res) => {
    notificationDB.deleteNotificationIdByProperty('id', req.body.id).then(() => {
        res.status(200).send();
    })
    .catch(error.router.internalError(res));
});

notification.post('/', error.router.validate('body', {
    type: /^(gcm)$/,
    subscription: 'validJSON'
}), (req, res) => {
    if (req.body.subscription === undefined) {
        res.status(200).send({});
    } else {
        notificationDB.createNotificationId(req.body).then((notification) => {
            res.status(200).send({});
        })
        .catch(error.router.internalError(res));
    }
});

module.exports = notification;