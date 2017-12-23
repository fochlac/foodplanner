import { handleErrors } from 'COMPONENTS/middleware/handleErrors.js';
import { create_error, delete_error } from 'COMPONENTS/actions.js';
import { expect } from 'chai';


describe('handleErrors', () => {
  it('should create error for the correct error type', () => {
    let act1 = {
            status: 'failure',
            data: {type: 'Internal_Error', reason: ''},
            actionId: 0
        },
        act2 = {
            status: 'failure',
            data: {type: 'Invalid_Request', reason: '', data: ['test']},
            actionId: 1
        },
        act3 = {
            status: 'failure',
            data: {type: 'Bad_Request', reason: 'offer_full'},
            actionId: 2
        };

    handleErrors({dispatch: action => {
        expect(action).to.deep.equal(create_error(act1.actionId, "Auf dem Server ist ein unbekannter Fehler aufgetreten, bitte wenden Sie sich an ihren Administrator."));
    }})((action) => {
        expect(action).to.deep.equal(act1);
    })(act1);

    handleErrors({dispatch: action => {
        expect(action).to.deep.equal(create_error(act2.actionId, `Der Server hat ihre Anfrage abgelehnt, bitte überprüfen Sie Ihre Eingaben für das Feld 'test'.`));
    }})((action) => {
        expect(action).to.deep.equal(act2);
    })(act2);

    handleErrors({dispatch: action => {
        expect(action).to.deep.equal(create_error(act3.actionId, "Das Angebot ist bereits voll belegt."));
    }})((action) => {
        expect(action).to.deep.equal(act3);
    })(act3);
  });
});