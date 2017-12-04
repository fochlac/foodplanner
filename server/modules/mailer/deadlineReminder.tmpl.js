const microMeal = require('./microMeal.tmpl.js');

module.exports = (user, meal) => ({
  from: 'Essensplaner',
  to: `${user.name} <${user.mail}>`,
  subject: `Erinnerung: Anmeldefrist für ${meal.name} läuft ab!`,
  html: `<h3>Hallo ${user.name}</h3>
        <p>Die Anmeldefrist für das Angebot ${meal} läuft in 2 Stunden ab:</p>
        ${microMeal(meal)}
        <p><a href="https://https://${process.env.FOOD_EXTERNAL}">Trage dich schnell ein,</a> solange noch Zeit ist!</p>
        <br>
        <p><a href="https://https://${process.env.FOOD_EXTERNAL}/unsubscribe?id=${user.id}&list=deadlineReminder">Klicke hier</a>, um dich von dieser Liste abzumelden <a href="https://https://${process.env.FOOD_EXTERNAL}/unsubscribe?id=${user.id}">oder hier</a>, um alle Emails von dieser Seite abzubestellen.</p>`
});