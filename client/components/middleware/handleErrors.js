import { create_error, delete_error } from '../actions.js';

export const handleErrors = store => next => action => {
    if (action.status === 'failure') {
        if (action.data.type === "Internal_Error") {
            store.dispatch(create_error(action.actionId, "Auf dem Server ist ein unbekannter Fehler aufgetreten, bitte wenden Sie sich an ihren Administrator."));
            setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000);
        }
        if (action.data.type === "Invalid_Request") {
            store.dispatch(create_error(action.actionId, `Der Server hat ihre Anfrage abgelehnt, bitte überprüfen Sie Ihre Eingaben  ${(action.data.data.length > 1) ? 'für die Felder:' : 'für das Feld'} '${action.data.data.join("', '")}'.`));
            setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000);
        }
        if (action.data.type === "Bad_Request" && action.data.reason === 'offer_full') {
            store.dispatch(create_error(action.actionId, `Das Angebot ist bereits voll belegt.`));
            setTimeout(() => store.dispatch(delete_error(action.actionId)), 10000);
        }
    }
    next(action);
}