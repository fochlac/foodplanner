let stash = [],
    stashTimer;

const	gmail 				= require('gmail-send')({ user: 'ep.mittagsplaner@gmail.com', pass: process.env.FOOD_MAILPW })
	,	error 	            = require(process.env.FOOD_HOME + 'modules/error')
	,	log 	            = require(process.env.FOOD_HOME + 'modules/log')
	,	mailDb 	            = require(process.env.FOOD_HOME + 'modules/db/mail')
    ,   deadlineReminder    = require(process.env.FOOD_HOME + 'modules/mailer/deadlineReminder.tmpl.js')
    ,   creationNotice      = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice.tmpl.js')
    ,   invitation      	= require(process.env.FOOD_HOME + 'modules/mailer/invitation.tmpl.js')

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
                if (!mail.length) {
                	clearInterval(stashTimer);
                }
            }, 1000);
        }
    }

module.exports = {
    sendDeadlineReminder(meal) {
        mailDb.getMailsByProperty('deadlineReminder', 1)
            .then((data) => {
                if (data.length) {
                    data.forEach(user => mail(deadlineReminder(user, meal), error.checkError(3, 'Error sending deadline reminder.'), user.name, 'creationNotice'));
                }
            }).catch(error.promise(4, 'error sending deadline mails'));
    },
	sendCreationNotice(meal) {
		mailDb.getMailsByProperty('creationNotice', 1)
			.then((data) => {
				if (data.length) {
					data.filter(user => (meal.name.includes('test') && user.name.includes('Florian') || !meal.name.includes('test')))
						.forEach(user => mail(creationNotice(user, meal), error.checkError(3, 'Error sending creation notice.'), user.name, 'creationNotice'));
				}
			}).catch(error.promise(4, 'error sending creation mails'));
	},
	sendInvitation(data) {
		data.forEach(user => {
			mail(invitation(user[0], user[1]), error.checkError(3, 'Error sending invitation.'), user[0], 'invitation');
		});
	}
}


