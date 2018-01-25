import app from 'COMPONENTS/reducers/app.js';
import { expect } from 'chai';

describe('app-reducer', () => {
    it('DIALOG', () => {
        const action = {
          type: 'DIALOG',
          content: 'test1',
          option: 'test2'
        }

        expect(app(
            {},
            action
        )).to.deep.equal({dialog: {
            type: action.content,
            option: action.option,
        }});

        expect(app(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            test4: '12312534',
            dialog: {
                type: action.content,
                option: action.option,
            }
        });
    });

    it('HISTORY', () => {
        const action = {
          type: 'HISTORY',
          app: 'test1',
          option: 'test2'
        }

        expect(app(
            {},
            action
        )).to.equal(action.app);

        expect(app(
            {
                test4: '12312534'
            },
            action
        )).to.equal(action.app);
    });

    it('INITIAL_USER', () => {
        const action = {
              type: 'INITIAL_USER',
              status: 'complete'
            },
        intialState =
            {
                test4: '12312534'
            };

        global.history = {};

        expect(app(
            intialState,
            action
        )).to.deep.equal( intialState );

        global.history = {
            state: {
                app: 'test'
            }
        }

        expect(app(
            intialState,
            action
        )).to.equal('test');

        action.status = 'asdas';

        expect(app(
            intialState,
            action
        )).to.deep.equal( intialState );

        global.history = {};
    });

    it('CHECK_MAIL', () => {
        const action = {
            type: 'CHECK_MAIL',
            status: 'complete',
            data: {
                test: 'test123',
            }
        }

        expect(app(
            {},
            action
        )).to.deep.equal({
            mailSuggestion: action.data
        });

        expect(app(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            mailSuggestion: action.data,
            test4: '12312534',
        });

        action.data.error = true;

        expect(app(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            mailSuggestion: undefined,
            test4: '12312534',
        });

        expect(app(
            {
                test4: '12312534',
                mailSuggestion: 'test123'
            },
            action
        )).to.deep.equal({
            mailSuggestion: undefined,
            test4: '12312534',
        });

        action.status = false;

        expect(app(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            test4: '12312534',
        });
    });

    it('SEND_MONEY, SIGNOUT, SAVE_SETTINGS', () => {
        const action = {
                type: 'SIGNOUT',
            },
            initialState = {
                test: '1231',
                mailSuggestion: '12312',
                dialog: '12312',
            },
            cleanState = {
                test: '1231',
                mailSuggestion: undefined,
                dialog: {type: ""}
            };

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);

        action.type = 'asdaw';
        action.status = 'complete';
        action.data = {};

        expect(app(
            initialState,
            action
        )).to.deep.equal(initialState);

        action.type = 'SEND_MONEY';

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);

        action.data.error = true;

        expect(app(
            initialState,
            action
        )).to.deep.equal(initialState);

        action.data.error = false;
        action.status = false;

        expect(app(
            initialState,
            action
        )).to.deep.equal(initialState);

        action.type = 'SIGNOUT';

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);
    });

    it('MEAL_SIGNUP, MEAL_EDIT, CREATE_MEAL, CANCEL_MEAL, SUBMIT_PRICES, EDIT_MEAL', () => {
        const action = {
                type: 'MEAL_SIGNUP',
                status: 'complete'
            },
            initialState = {
                test: '1231',
                mailSuggestion: '12312',
                dialog: '12312',
            },
            cleanState = {
                test: '1231',
                mailSuggestion: '12312',
                dialog: {type: ""}
            };

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);

        action.status = 'complete';

        action.status = false;

        expect(app(
            initialState,
            action
        )).to.deep.equal(initialState);
    });

    it('BUSY', () => {
        const action = {
                type: 'BUSY',
                state: 'complete'
            },
            initialState = {
                test: '1231',
            },
            cleanState = {
                test: '1231',
                busy: 'complete'
            };

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);
    });

    it('HIDDEN_BUSY', () => {
        const action = {
                type: 'HIDDEN_BUSY',
                state: 'complete'
            },
            initialState = {
                test: '1231',
            },
            cleanState = {
                test: '1231',
                hiddenBusy: 'complete'
            };

        expect(app(
            initialState,
            action
        )).to.deep.equal(cleanState);
    });

    it('POSTMESSAGE', () => {
        const action = {
                type: 'POSTMESSAGE',
                message: 'offline',
                payload: {state: true},
            };

        expect(app(
            {},
            action
        )).to.deep.equal({offline: true});

        action.payload.state = 'asdas';

        expect(app(
            {
                test: '123',
                offline: true,
            },
            action
        )).to.deep.equal({
            test: '123',
            offline: 'asdas'
        });

        action.message = 'asdas';

        expect(app(
            {
                test: '123'
            },
            action
        )).to.deep.equal({
            test: '123'
        });
    });

    it('SHOW_ERROR', () => {
        const action = {
                type: 'SHOW_ERROR',
                id: 10,
                content: 'test'
            };

        expect(app(
            {},
            action
        )).to.deep.equal({
            errors: {
                10: 'test',
            }
        });

        expect(app(
            {
                test: '123',
                errors: {
                    1: 'asd'
                }
            },
            action
        )).to.deep.equal({
            test: '123',
            errors: {
                1: 'asd',
                10: 'test',
            }
        });
    });

    it('DELETE_ERROR', () => {
        const action = {
                type: 'DELETE_ERROR',
                id: 10
            };

        expect(app(
            {
                errors: {
                    10: 'test',
                }
            },
            action
        )).to.deep.equal({
            errors: {
            }
        });

        expect(app(
            {
                test: '123',
                errors: {
                    1: 'asd',
                    10: 'test',
                }
            },
            action
        )).to.deep.equal({
            test: '123',
            errors: {
                1: 'asd',
            }
        });
    });

    it('REFRESH', () => {
        const action = {
                type: 'REFRESH',
                status: 'complete',
                data: {
                    version: 10
                }
            };

        expect(app(
            {},
            action
        )).to.deep.equal({
            dataversion: 10
        });

        expect(app(
            {
                dataversion: 9
            },
            action
        )).to.deep.equal({
            dataversion: 10
        });

        action.status = false;

        expect(app(
            {
                test: '123',
                errors: {
                    1: 'asd',
                }
            },
            action
        )).to.deep.equal({
            test: '123',
            errors: {
                1: 'asd',
            }
        });
    });
});
