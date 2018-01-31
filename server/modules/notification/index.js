const   message         = require('web-push')
    ,   notificationDB  = require(process.env.FOOD_HOME + 'modules/db/notification')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');
// set api key for Google Cloud Messaging
message.setGCMAPIKey('AIzaSyDgzSYIANLADfeZwszA3ujbVGmxTDpzxiI');
// set Vapid details, generate with webpush.generateVAPIDKeys();
message.setVapidDetails(
  'mailto:fochlac@gmail.com',
  'BLaOlvhqet3tC5e6oIliQr5NF2Sqn8VHq9VjzR9ItF9AnHFgYaB3dN38rTuYC6tKSRxzzTFmMia6kJ_J2auGLCU',
  'XUrwfTFYENtpbX63Wx9drwlfsB8n3RWnmc-156PeexI'
);



module.exports = {
    sendCreationNotice: (meal) => {
        // get user subscriptions
        return notificationDB.getAllNotificationIds()
            .then(results => {
                const payload = JSON.stringify({type: 'creationNotice', data: meal}),
                      ttl = meal.deadline - Date.now();

                return Promise.all(results.map(row => {
                  const subscription = JSON.parse(row.subscription);

                  // send push notification for each subscription
                  message.sendNotification(subscription, payload, {TTL: 100000})
                    .catch(err => {
                      if (err.statusCode === 410) {
                        // if unreachable, remove from list
                        return notificationDB.deleteNotificationIdByProperty('id', row.id);
                      } else {
                        return Promise.reject(err);
                      }
                    })
                  }));

            }).catch(error.promise(4, 'error sending creation notification'));
    }
}