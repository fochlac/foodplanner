const 	scheduler 	= require('node-schedule')
	,	mail 		= require(process.env.FOOD_HOME + 'modules/mailer')
	,	mealDb 		= require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   error       = require(process.env.FOOD_HOME + 'modules/error');

const second = 1000,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

const mealDeadline = (meal) => {
	mealDb.getMealByProperty('id', meal.id)
		.then((result) => {
			if (result.deadline) {
				mail.sendDeadlineReminder(meal);
			}
		})
		.catch(error.promise(4, 'could not find meal ' + meal.id));
	// trigger push
}


module.exports = {
	init: () => {
		mealDb.getAllMeals()
			.then((meals) => {
				meals.forEach(meal => {
					scheduler.scheduleJob(new Date(meal.deadline - hour * 2), mealDeadline)
				});
			});
	},
	scheduleMeal: meal => {
		scheduler.scheduleJob(new Date(meal.deadline - hour * 2), mealDeadline);
	}
}
