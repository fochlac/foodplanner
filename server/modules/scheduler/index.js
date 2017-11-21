const 	scheduler 	= require('node-schedule')
	,	mail 		= require(process.env.FOOD_HOME + 'modules/mailer')
	,	mealDb 		= require(process.env.FOOD_HOME + 'modules/db/meals')
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
					schedule['meal_' + meal.id] = scheduler.scheduleJob(new Date(meal.deadline - hour * 2), mealDeadline)
				});
			});
	},
	scheduleMeal: meal => {
		schedule['meal_' + meal.id] = scheduler.scheduleJob(new Date(meal.deadline - hour * 2), mealDeadline);
	},
	rescheduleMeal: meal => {
		schedule['meal_' + meal.id].cancel();
		schedule['meal_' + meal.id] = scheduler.scheduleJob(new Date(meal.deadline - hour * 2), mealDeadline);
	},
	cancelMeal : id => {
		schedule['meal_' + meal.id].cancel();
	}
}
