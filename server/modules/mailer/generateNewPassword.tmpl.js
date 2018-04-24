// prettier-ignore
module.exports = (user, id) => instanceUrl => ({
  from: 'Essensplaner',
  to: `${user.name} <${user.mail}>`,
  subject: `Dein neues Passwort!`,
  html: `<style>p {margin: 3px 0;}h3,h4{margin: 5px 0 7px; flex-direction: column;}</style>
    <h3>Hallo ${user.name}</h3>
    <br/>
    <p>Das zurücksetzen deines Passwordes wurde angefordert.</p>
    <p>Wenn du dein Passwort jetzt zurücksetzen möchtest, klicke auf den folgenden Link:</p>
    <a href="${instanceUrl}api/user/resetPassword?id=${id}">Passwort zurücksetzen!</a>`,
})
