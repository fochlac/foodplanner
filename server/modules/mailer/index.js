const	mail 	            = require('mailgun-js')({apiKey: process.env.MAILGUN_APIKEY, domain: 'mg.fochlac.com'})
	,	error 	            = require(process.env.FOOD_HOME + 'modules/error')
	,	mailDb 	            = require(process.env.FOOD_HOME + 'modules/db/mail')
    ,   deadlineReminder    = require(process.env.FOOD_HOME + 'modules/mailer/deadlineReminder.tmpl.js')
    ,   creationNotice      = require(process.env.FOOD_HOME + 'modules/mailer/creationNotice.tmpl.js');

module.exports = {
    sendDeadlineReminder(meal) {
        mailDb.getMailsByProperty('deadlineReminder', 1)
            .then((data) => {
                if (data.length) {
                    data.forEach(user => mail.messages().send(deadlineReminder(user, meal), error.checkError(3, 'Error sending deadline reminder.')));
                }
            }).catch(error.promise(4, 'error sending deadline mails'));
    },
	sendCreationNotice(meal) {
		mailDb.getMailsByProperty('creationNotice', 1)
			.then((data) => {
				if (data.length) {
					data.forEach(user => mail.messages().send(creationNotice(user, meal), error.checkError(3, 'Error sending creation notice.')));
				}
			}).catch(error.promise(4, 'error sending creation mails'));
	}
}