const 	scheduler 	= require('node-schedule')
	,	mail 		= require(process.env.FOOD_HOME + 'modules/mailer')
	,	mealDb 		= require(process.env.FOOD_HOME + 'modules/db/meals')
	,	paymentDb 	= require(process.env.FOOD_HOME + 'modules/db/payment')
    ,   log         = require(process.env.FOOD_HOME + 'modules/log')
    ,   cache       = require(process.env.FOOD_HOME + 'modules/cache')
    ,   error       = require(process.env.FOOD_HOME + 'modules/error');

const second = 1000,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

let schedule = {},
	signupCache = cache.getCache('signups');

const mealDeadline = (meal) => () => {
	log(5, 'deadline reminder for meal ' + meal.name + ' triggered.');
	mail.sendDeadlineReminder(meal);
}


const mealPayment = (meal) => () => {
	mealDb.getMealById(meal.id)
		.then(meal => {
			if (meal.locked) {
    			signupCache.deleteAll();
				return meal.id;
			} else {
				return Promise.reject('meal not locked yet')
			}
		})
		.then(id => paymentDb.getEligibleSignups(id))
        .then((eligibleSignups) => Promise.all(
            eligibleSignups.map(
                result => paymentDb.payForSignup(result.id)
                    .then(res => Promise.resolve({error: false, data: res}),
                        err => Promise.resolve({error: true, data: err})
                    )
            )
        ))
        .then(results => log(6, results.filter(res => !res.error).length + ' payments of ' + results.length + ' possible payments failed.'))
        .catch(error.promise(4, 'unable to trigger autopayment'));
}

module.exports = {
	init: () => {
		console.log(Date.now())
		mealDb.getAllMeals()
			.then((meals) => {
				meals.forEach(meal => {
					if (Date.now() < +meal.deadline - hour * 2) {
						let date = new Date(meal.deadline - hour * 2);
						log(6, `scheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);
						schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline(meal))
					}
				});
			});
	},
	scheduleMeal: meal => {
		let date = new Date(meal.deadline - hour * 2),
			date2 = new Date(meal.deadline + minute * 2);
		log(6, `scheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);
		schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline(meal));
		schedule['meal_payment_' + meal.id] = scheduler.scheduleJob(date2, mealPayment(meal));
	},
	rescheduleMeal: meal => {
		let date = new Date(meal.deadline - hour * 2),
			date2 = new Date(meal.deadline + minute * 2);

		log(6, `rescheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);

		if (schedule['meal_' + meal.id]) {
			schedule['meal_' + meal.id].cancel();
		}
		if (schedule['meal_payment_' + meal.id]) {
			schedule['meal_payment_' + meal.id].cancel();
		}

		schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline(meal));
		schedule['meal_payment_' + meal.id] = scheduler.scheduleJob(date2, mealPayment(meal));
	},
	cancelMeal : id => {
		log(6, `canceling deadline reminder for meal_${id}`);
		if (schedule['meal_' + id]) {
			schedule['meal_' + id].cancel();
		}
		if (schedule['meal_payment_' + id]) {
			schedule['meal_payment_' + id].cancel();
		}
	}
}
