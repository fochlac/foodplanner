const notificationDB = require(process.env.FOOD_HOME + 'modules/db/notification')
  , error = require(process.env.FOOD_HOME + 'modules/error');

module.exports = {
  delete: (req, res) => {
    notificationDB.deleteNotificationIdByProperty('id', req.body.id)
      .then(() => {
        res.status(200).send();
      })
      .catch(error.router.internalError(res));
  },

  create: (req, res) => {
    if (req.body.subscription) {
      notificationDB.createNotificationId(req.instance, req.body)
        .then((notification) => {
          res.status(200).send({});
        })
        .catch(error.router.internalError(res));
    } else {
      res.status(200).send({});
    }
  }
}
