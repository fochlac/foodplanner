const second = 1000,
    minute = 60 * second,
    hour = 60 * minute,
    day = 24 * hour,
    week = 7 * day,
    year = 365 * day,
    tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

function fill(val, n) {
    return ('0'.repeat(n) + val).slice(-n);
}

function formatTimeShort (date) {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date),
        diff = Date.now() - ((date.toString().length === 10) ? (date * 1000) : date);

    if (diff < -week) {
        `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    } else if (diff < -day) {
        return `${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    } else if (diff < -2 * hour) {
        return `in ${-Math.floor(diff / hour)} Stunden`;
    } else if (diff < -hour) {
        return `in 1 Stunde`;
    } else if (diff < -minute) {
        return `in ${-Math.floor(diff / minute)} Minuten`;
    } else if (diff < 0) {
        return `in 1 Minute`;
    } else if (diff < 2 * minute) {
        return `vor 1 Minute`;
    } else if (diff < hour) {
        return `vor ${Math.floor(diff / minute)} Minuten`;
    } else if (diff < 2 * hour) {
        return `vor 1 Stunde`;
    } else if (diff < day) {
        return `vor ${Math.floor(diff / hour)} Stunden`;
    } else if (diff < week) {
        return `letzten ${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    }
    return `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}

module.exports = (user, meal) => ({
  from: 'Essensplaner <food@fochlac.com>',
  to:  `${user.name} <${user.mail}>`,
  subject: `Neues Angebot: ${meal.name} von ${meal.creator}`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px;}</style>
    <h3>Hallo ${user.name}</h3>
    <p>Gute Neuigkeiten, ${meal.creator} hat ein neues Angebot erstellt:</p>
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
    <p><a href="https://food.fochlac.com">Trage dich schnell ein,</a> solange noch Platz ist!</p>
    <br>
    <hr>
    <p><a href="https://food.fochlac.com/unsubscribe?id=${user.id}&list=deadlineReminder">Klicke hier</a> um dich von dieser Liste abzumelden, <a href="https://food.fochlac.com/unsubscribe?id=${user.id}">oder hier</a> um alle Emails von dieser Seite abzubestellen.</p>`
});