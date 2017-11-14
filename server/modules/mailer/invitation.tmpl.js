const microMeal = require('./microMeal.tmpl.js');

module.exports = (name, mail) => ({
  to:  `${mail}`,
  subject: `Neuer Mittagsplaner`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px;}</style>
    <h3>Hallo zusammen,</h3>
    <p>nachdem die alte Mittagsplan-Seite abgeschaltet wurde, habe ich eine neue angelegt.</p>
    <p>Um bei neuen Essensangeboten automatisch benachrichtig zu werden, könnt ihr euch ab sofort auf <a href="https://food.fochlac.com/subscribe?mail=${encodeURIComponent(mail)}&name=${encodeURIComponent(name)}">food.fochlac.com</a> eintragen.</p>
    <p>Die Seite ist noch nicht fertig, aber die Grundfunktionalitäten sind vorhanden und sollten funktionieren.</p>
    <br/>
    <p>Gruß, Florian</p>`
});