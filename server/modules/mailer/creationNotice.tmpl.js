const microMeal = require('./microMeal.tmpl.js');
const picoMeal = require('./picoMeal.tmpl.js');

module.exports = (user, meal) => ({
  from: 'Essensplaner <food@fochlac.com>',
  to:  `${user.name} <${user.mail}>`,
  subject: `Neues Angebot: ${meal.name} von ${meal.creator}`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px; flex-direction: column;}</style>
    <h3>Hallo ${user.name}</h3>
    <p>Gute Neuigkeiten, ${meal.creator} hat ein neues Angebot erstellt:</p>
    ${microMeal(meal)}
    <p><a href="https://${process.env.FOOD_EXTERNAL}">Trage dich schnell ein,</a> solange noch Platz ist!</p>
    <br>
    <hr>
    <p><a href="https://${process.env.FOOD_EXTERNAL}/unsubscribe?id=${user.id}&list=deadlineReminder">Klicke hier</a>, um dich von dieser Liste abzumelden <a href="https://${process.env.FOOD_EXTERNAL}/unsubscribe?id=${user.id}">oder hier</a>,  um alle Emails von dieser Seite abzubestellen.</p>
    <p style="font-size: 0.8em; color: #ccc;margin-top:10px;">${picoMeal(meal)}</p>`
});