const date = require(process.env.FOOD_HOME + 'helper/date.js')

// prettier-ignore
module.exports = (meal, instanceUrl) =>
`Neues Essensangebot ${meal.name} von ${meal.creator} für ${date.formatDateTime(meal.time)}<br/>
Bestellung möglich bis ${date.formatDateTime(meal.deadline)}<br/>
${instanceUrl}`;
