import signups from 'COMPONENTS/reducers/signups.js';

describe('signups-reducer', () => {
    test('MEAL_EDIT', () => {
        const action = {
          type: 'MEAL_EDIT',
          status: 'complete',
          data: {
            id: 1,
            test: 'test123',
            test2: 'test1234',
          }
        }

        expect(signups(
            {},
            action
        )).toEqual({
            [1]: action.data,
        });

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            [1]: action.data,
            test4: '12312534',
        });

        expect(signups(
            {
                test4: '12312534',
                1: {
                    test: 123,
                    test3: 345,
                }
            },
            action
        )).toEqual({
            [1]: {
                ...action.data,
                test3: 345
            },
            test4: '12312534',
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('SIGNUP_PAID', () => {
        const action = {
          type: 'SIGNUP_PAID',
          status: 'complete',
          id: 1,
          state: true,
        }

        expect(signups(
            {},
            action
        )).toEqual({
            [1]: {
                paid: true
            },
        });

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            [1]: {
                paid: true
            },
            test4: '12312534',
        });

        expect(signups(
            {
                test4: '12312534',
                1: {
                    test3: 345,
                }
            },
            action
        )).toEqual({
            [1]: {
                paid: true,
                test3: 345
            },
            test4: '12312534',
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('MEAL_SIGNUP', () => {
        const action = {
          type: 'MEAL_SIGNUP',
          status: 'complete',
          data: {
            id: 1,
            test: 'test123',
            test2: 'test1234',
          }
        }

        expect(signups(
            {},
            action
        )).toEqual({
            [1]: action.data,
        });

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            [1]: action.data,
            test4: '12312534',
        });

        expect(signups(
            {
                test4: '12312534',
                1: {
                    test: 123,
                    test3: 345,
                }
            },
            action
        )).toEqual({
            [1]: action.data,
            test4: '12312534',
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('INITIAL_SIGNUPS', () => {
        const action = {
            type: 'INITIAL_SIGNUPS',
            status: 'complete',
            data: [{
                id: 1,
                test: 'test123',
                test2: 'test1234',
            }, {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }]
        }

        expect(signups(
            {},
            action
        )).toEqual({
            [1]: {
                id: 1,
                test: 'test123',
                test2: 'test1234',
              },
            [2]: {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }
        });

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            [1]: {
                id: 1,
                test: 'test123',
                test2: 'test1234',
              },
            [2]: {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('REFRESH', () => {
        const action = {
            type: 'REFRESH',
            status: 'complete',
            data: {signups: [{
                id: 1,
                test: 'test123',
                test2: 'test1234',
            }, {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }]}
        }

        expect(signups(
            {},
            action
        )).toEqual({
            [1]: {
                id: 1,
                test: 'test123',
                test2: 'test1234',
              },
            [2]: {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }
        });

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            [1]: {
                id: 1,
                test: 'test123',
                test2: 'test1234',
              },
            [2]: {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
            }
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('FINALIZE_PRICES', () => {
        const action = {
            type: 'FINALIZE_PRICES',
            status: 'complete',
            data: [{
                id: 1,
                price: 2,
                paid: 0,
            }, {
                id: 2,
                price: 3,
                paid: 1,
            }]
        }

        expect(signups(
            {
                [1]: {
                    id: 1,
                    test: 'test123',
                    test2: 'test1234',
                    paid: 1,
                  },
                [2]: {
                    id: 2,
                    test2: 'test1223',
                    test3: 'test12334',
                    price: 3,
                },
                [3]: {
                    id: 3,
                    test2: 'test1223',
                    test3: 'test12334',
                }
            },
            action
        )).toEqual({
            [1]: {
                id: 1,
                test: 'test123',
                test2: 'test1234',
                price: 2,
                paid: 0,
              },
            [2]: {
                id: 2,
                test2: 'test1223',
                test3: 'test12334',
                price: 3,
                paid: 1,
            },
            [3]: {
                id: 3,
                test2: 'test1223',
                test3: 'test12334',
            }
        });

        action.status = 'asd';

        expect(signups(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('MEAL_CANCEL', () => {
        const action = {
            type: 'MEAL_CANCEL',
            status: 'complete',
            id: 1,
        }

        expect(signups(
            {},
            action
        )).toEqual({});

        expect(signups(
            {
                1: '12312534'
            },
            action
        )).toEqual({});

        expect(signups(
            {
                1: '12312534',
                2: '12312534',
                3: '12312534',
            },
            action
        )).toEqual({
            2: '12312534',
            3: '12312534',
        });

        action.status = 'asd';

        expect(signups(
            {
                1: '12312534'
            },
            action
        )).toEqual({
            1: '12312534',
        });
    });

    test('default', () => {
        const action = {
            type: 'asdawd',
            status: 'complete',
            id: 1,
        }

        expect(signups(
            {
                1: '12312534',
                2: '12312534',
                3: '12312534',
            },
            action
        )).toEqual({
            1: '12312534',
            2: '12312534',
            3: '12312534',
        });
    });
});