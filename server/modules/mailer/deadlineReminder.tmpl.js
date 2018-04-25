const microMeal = require('./microMeal.tmpl.js')

// prettier-ignore
module.exports = (user, meal) => (instanceUrl) => ({
  from: 'Essensplaner',
  to: `${user.name} <${user.mail}>`,
  subject: `Erinnerung: Anmeldefrist für ${meal.name} läuft ab!`,
  html: `<h3>Hallo ${user.name}</h3>
        <p>Die Anmeldefrist für das Angebot ${meal.name} läuft in 2 Stunden ab:</p>
        ${microMeal(meal, instanceUrl)}
        <p><a href="${instanceUrl}">Trage dich schnell ein,</a> solange noch Zeit ist!</p>
        <br>
        <p><a href="${instanceUrl}unsubscribe?id=${user.id}&list=deadlineReminder">Klicke hier</a>, um dich von dieser Liste abzumelden
        <a href="${instanceUrl}unsubscribe?id=${user.id}">oder hier</a>, um alle Emails von dieser Seite abzubestellen.</p>`
});
