const date = require(process.env.FOOD_HOME + 'helper/date.js');

module.exports = (meal) =>
`Neues Essensangebot ${meal.name} von ${meal.creator} für ${date.formatDateTime(meal.time)}<br/>
Bestellung möglich bis ${date.formatDateTime(meal.deadline)}<br/>
https://food.fochlac.com/`;