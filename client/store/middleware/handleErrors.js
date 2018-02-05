import { create_error, delete_error } from 'STORE/actions.js'

export const handleErrors = store => next => action => {
  if (action.status === 'failure') {
    if (action.data.type === 'Internal_Error') {
      store.dispatch(create_error(action.actionId, 'Auf dem Server ist ein unbekannter Fehler aufgetreten, bitte wenden Sie sich an Ihren Administrator.'))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'Invalid_Request') {
      store.dispatch(
        create_error(
          action.actionId,
          `Der Server hat Ihre Anfrage abgelehnt, bitte überprüfen Sie Ihre Eingaben ${
            action.data.data.length > 1 ? 'für die Felder:' : 'für das Feld'
          } '${action.data.data.join("', '")}'.`,
        ),
      )
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'FORBIDDEN') {
      store.dispatch(create_error(action.actionId, `Der Server hat Ihre Anfrage abgelehnt, da Sie über unzureichende Rechte verfügen.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'UNAUTHORIZED') {
      store.dispatch(create_error(action.actionId, `Der Server hat Ihre Anfrage abgelehnt, da Sie nicht angemeldet sind.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'BAD_PASSWORD') {
      store.dispatch(create_error(action.actionId, `Fehlerhaftes Passwort. Bitte versuchen Sie es erneut.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'BAD_USER') {
      store.dispatch(create_error(action.actionId, `Unbekannte Email-Addresse. Bitte versuchen Sie es erneut.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'Bad_Request' && action.data.reason === 'offer_full') {
      store.dispatch(create_error(action.actionId, `Das Angebot ist bereits voll belegt.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'Bad_Request' && action.data.reason === 'user_exists') {
      store.dispatch(create_error(action.actionId, `Ein Nutzer mit dieser Email-Adresse existiert bereits.`))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    } else if (action.data.type === 'Bad_Request' && action.data.reason === 'userfault') {
      store.dispatch(create_error(action.actionId, action.data.message))
      setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000)
    }
  }
  next(action)
}
