const microMeal = require('./microMeal.tmpl.js')
const picoMeal = require('./picoMeal.tmpl.js')
const date = require(process.env.FOOD_HOME + 'helper/date.js')

// prettier-ignore
module.exports = (user, meal) => instanceUrl => ({
  from: 'Essensplaner',
  to: `${user.name} <${user.mail}>`,
  subject: `Neues Terminumfrage: ${meal.name} von ${meal.creator}`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px; flex-direction: column;}</style>
    <h3>Hallo ${user.name}</h3>
    <p>Gute Neuigkeiten, ${meal.creator} hat eine neue Terminumfrage erstellt:</p>
    ${microMeal(meal)}
    <p>Du hast bis zum ${date.formatDateTime(meal.time)} Zeit <a href="${instanceUrl}">dich einzutragen</a></p>
    <br>
    <hr>
    <p>
      <a href="${instanceUrl}unsubscribe?id=${user.id}&list=creationNotice">Klicke hier</a>,
       um dich von dieser Liste abzumelden <a href="${instanceUrl}unsubscribe?id=${user.id}">oder hier</a>,
       um alle Emails von dieser Seite abzubestellen.</p>`,
})
