// prettier-ignore
module.exports = (user, pass) => instanceUrl => ({
  from: 'Essensplaner',
  to: `${user.name} <${user.mail}>`,
  subject: `Dein neues Passwort!`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px; flex-direction: column;}</style>
    <h3>Hallo ${user.name}</h3>
    <p>Du hast ein neues Passwort angefordert:</p>
    <p>Es lautet <b>${pass}</b></p>
    <p>Bitte denke bei deinem nächsten Login daran ein neues Passwort zu erstellen.</p>`,
})
