module.exports = (user, meal) => ({
  from: 'Essensplaner <food@fochlac.com>',
  to: `${user.name} <${user.mail}>`,
  subject: `Erinnerung: Anmeldefrist für ${meal.name} läuft ab!`,
  html: `<h3>Hallo ${user.name}</h3>
        <p>Die Anmeldefrist für das Angebot ${meal} läuft in 2 Stunden ab:</p>
        <div style="display:flex;flex-direction: column;padding:10px 20px; border:solid 1px;max-width: 700px;margin:10px 20px;">
          <div>
            <a href="https://food.fochlac.com"><h3>${meal.name}</h3></a>
          </div>
          <div style="display:flex;">
            <div style="width:150px;max-height:150px;display:flex;justify-content:center;align-items:center;margin-right:20px;${meal.image.length ? '' : 'display:none;'}">
                <img style="max-width:100%;max-height:100%;" src="${meal.image}" alt="" />
            </div>
            <div style="align-self: flex-start;">
                <p>Organisator: ${meal.creator}</p>
                <p>Teilnehmergrenze: ${meal.signupLimit ? meal.signupLimit : 'keine'}</p>
                <p>Anmeldeschluss: ${formatTimeShort(meal.deadline)}</p>
                <p>Lieferzeitpunkt: ${formatTimeShort(meal.time)}</p>
            </div>
            <div style="flex-shrink:1;margin-left:10px;">
              <h4>Beschreibung:</h4>
              <p>${meal.description}</p>
            </div>
          </div>
        </div>
        <p><a href="https://food.fochlac.com">Trage dich schnell ein,</a> solange noch Zeit ist!</p>
        <br>
        <p><a href="https://food.fochlac.com/unsubscribe?id=${user.id}&list=deadlineReminder">Klicke hier</a> um dich von dieser Liste abzumelden, <a href="https://food.fochlac.com/unsubscribe?id=${user.id}">oder hier</a> um alle Emails von dieser Seite abzubestellen.</p>`
});