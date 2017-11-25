const 	scheduler 	= require('node-schedule')
	,	mail 		= require(process.env.FOOD_HOME + 'modules/mailer')
	,	mealDb 		= require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   log         = require(process.env.FOOD_HOME + 'modules/log')
    ,   error       = require(process.env.FOOD_HOME + 'modules/error');

const second = 1000,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

let schedule = {};

const mealDeadline = (meal) => () => {
	mail.sendDeadlineReminder(meal);
	// trigger push
}

module.exports = {
	init: () => {
		mealDb.getAllMeals()
			.then((meals) => {
				meals.forEach(meal => {
					if (Date.now() < +meal.deadline) {
						let date = new Date(meal.deadline - hour * 2);
						log(6, `scheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);
						schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline)
					}
				});
			});
	},
	scheduleMeal: meal => {
		let date = new Date(meal.deadline - hour * 2);
		log(6, `scheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);
		schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline)
	},
	rescheduleMeal: meal => {
		let date = new Date(meal.deadline - hour * 2);
		log(6, `rescheduling deadline reminder for ${meal.name} at ${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`);
		if (schedule['meal_' + meal.id]) {
			schedule['meal_' + meal.id].cancel();
		}
		schedule['meal_' + meal.id] = scheduler.scheduleJob(date, mealDeadline)
	},
	cancelMeal : id => {
		log(6, `canceling deadline reminder for meal_${id}`);
		if (schedule['meal_' + id]) {
			schedule['meal_' + id].cancel();
		}
	}
}
