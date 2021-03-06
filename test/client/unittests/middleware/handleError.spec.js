import { create_error, delete_error } from 'STORE/actions.js'

import { handleErrors } from 'STORE/middleware/handleErrors.js'

describe('handleErrors', () => {
  test('should create error for the correct error type', () => {
    let act1 = {
        status: 'failure',
        data: { type: 'Internal_Error', reason: '' },
        actionId: 0,
      },
      act2 = {
        status: 'failure',
        data: { type: 'Invalid_Request', reason: '', data: ['test'] },
        actionId: 1,
      },
      act2a = {
        status: 'failure',
        data: { type: 'Invalid_Request', reason: '', data: ['test', 'test', 'test'] },
        actionId: 1,
      },
      act3 = {
        status: 'failure',
        data: { type: 'Bad_Request', reason: 'offer_full' },
        actionId: 2,
      },
      act4 = {
        status: 'failure',
        data: { type: 'FORBIDDEN' },
        actionId: 2,
      },
      act5 = {
        status: 'failure',
        data: { type: 'UNAUTHORIZED' },
        actionId: 2,
      },
      act6 = {
        status: 'failure',
        data: { type: 'Bad_Request', reason: 'user_exists' },
        actionId: 2,
      },
      act7 = {
        status: 'failure',
        data: { type: 'Bad_Request', reason: 'userfault', message: 'test123' },
        actionId: 2,
      },
      act9 = {
        status: 'failure',
        data: { type: 'BAD_PASSWORD' },
        actionId: 2,
      },
      act10 = {
        status: 'failure',
        data: { type: 'BAD_USER' },
        actionId: 2,
      },
      act8 = {
        actionId: 2,
      }

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(
          create_error(act1.actionId, 'Auf dem Server ist ein unbekannter Fehler aufgetreten, bitte wenden Sie sich an Ihren Administrator.'),
        )
      },
    })(action => {
      expect(action).toEqual(act1)
    })(act1)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act2.actionId, `Der Server hat Ihre Anfrage abgelehnt, bitte überprüfen Sie Ihre Eingaben für das Feld 'test'.`))
      },
    })(action => {
      expect(action).toEqual(act2)
    })(act2)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(
          create_error(act2a.actionId, `Der Server hat Ihre Anfrage abgelehnt, bitte überprüfen Sie Ihre Eingaben für die Felder: 'test', 'test', 'test'.`),
        )
      },
    })(action => {
      expect(action).toEqual(act2a)
    })(act2a)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act3.actionId, 'Das Angebot ist bereits voll belegt.'))
      },
    })(action => {
      expect(action).toEqual(act3)
    })(act3)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act4.actionId, 'Der Server hat Ihre Anfrage abgelehnt, da Sie über unzureichende Rechte verfügen.'))
      },
    })(action => {
      expect(action).toEqual(act4)
    })(act4)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act5.actionId, 'Der Server hat Ihre Anfrage abgelehnt, da Sie nicht angemeldet sind.'))
      },
    })(action => {
      expect(action).toEqual(act5)
    })(act5)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act6.actionId, 'Ein Nutzer mit dieser Email-Adresse existiert bereits.'))
      },
    })(action => {
      expect(action).toEqual(act6)
    })(act6)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act7.actionId, act7.data.message))
      },
    })(action => {
      expect(action).toEqual(act7)
    })(act7)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act9.actionId, 'Fehlerhaftes Passwort. Bitte versuchen Sie es erneut.'))
      },
    })(action => {
      expect(action).toEqual(act9)
    })(act9)

    handleErrors({
      dispatch: action => {
        expect(action).toEqual(create_error(act10.actionId, 'Unbekannte Email-Addresse. Bitte versuchen Sie es erneut.'))
      },
    })(action => {
      expect(action).toEqual(act10)
    })(act10)

    handleErrors({
      dispatch: action => {
        expect(1).toEqual(2)
      },
    })(action => {
      expect(action).toEqual(act8)
    })(act8)
  })
})
