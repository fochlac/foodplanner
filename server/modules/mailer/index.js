let stash = [],
    stashTimer;

const   gmail               = require('gmail-send')({ user: 'ep.mittagsplaner@gmail.com', pass: process.env.FOOD_MAILPW })
    ,   error               = require(process.env.FOOD_HOME + 'modules/error')
    ,   log                 = require(process.env.FOOD_HOME + 'modules/log')
    ,   userDb              = require(process.env.FOOD_HOME + 'modules/db/user')
    ,   signupsDb           = require(process.env.FOOD_HOME + 'modules/db/signups')
    ,   deadlineReminder    = require(process.env.FOOD_HOME + 'modules/mailer/deadlineReminder.tmpl.js')
    ,   creationNotice      = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice.tmpl.js')
    ,   creationNotice_df   = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice_datefinder.tmpl.js')
    ,   invitation          = require(process.env.FOOD_HOME + 'modules/mailer/invitation.tmpl.js')

    ,   mail = (tmpl, cb, user, type) => {
            stash.push({tmpl, cb, user, type});
            if (!stashTimer) {
                stashTimer = setInterval(() => {
                    let mail = stash.shift();

                    gmail(mail.tmpl, (err) => {
                        if (!err) {
                            log(5, `sent ${mail.type}-mail to ${mail.user}`);
                        }
                        mail.cb(err);
                    });

                    if (!stash.length) {
                        clearInterval(stashTimer);
                        stashTimer = false;
                    }
                }, 1000);
            }
        };

module.exports = {
    sendDeadlineReminder(meal) {
        let signupsAvailable = Promise.resolve();

        if (meal.signupLimit) {
            signupsAvailable = signupsDb.getSignupsByProperty('meal', meal.id)
                .then(result => {
                    if (result.length === meal.signupLimit) {
                        log(5, 'meal full - not sending reminder')
                        return Promise.reject();
                    }
                });
        }

        signupsAvailable
            .then(() => userDb.getUnsignedUsersByProperty(meal.id, 'deadlineReminder', 1))
            .then((data) => {
                if (data.length) {
                    data.forEach(user => mail(deadlineReminder(user, meal), error.checkError(3, 'Error sending deadline reminder.'), user.name, 'deadlineReminder'));
                }
            }).catch(error.promise(4, 'error sending deadline mails'));
    },
    sendCreationNotice(instance, meal) {
        log(6, 'sending creation notice for meal ' + meal.name);
        userDb.getUsersByProperty(instance, 'creationNotice', 1)
            .then((data) => {
                if (data.length) {
                    data.forEach(user => mail(meal.datefinder ? creationNotice_df(user, meal) : creationNotice(user, meal), error.checkError(3, 'Error sending creation notice.'), user.name, 'creationNotice'));
                } else {
                    log(6, 'no users found', data);
                }
            }).catch(error.promise(4, 'error sending creation mails'));
    },
    sendInvitation(data) {
        data.forEach(user => {
            mail(invitation(user[0], user[1]), error.checkError(3, 'Error sending invitation.'), user[0], 'invitation');
        });
    }
}


