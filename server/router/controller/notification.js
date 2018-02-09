const notificationDB = require(process.env.FOOD_HOME + 'modules/db/notification');

module.exports = {
  delete: (req, res) => {
    notificationDB.deleteNotificationIdByProperty('id', req.body.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(error.router.internalError(res));
  },

  create: (req, res) => {
    notificationDB.createNotificationId(req.body)
    .then((notification) => {
      res.status(200).send({});
    })
    .catch(error.router.internalError(res));
  }
}
