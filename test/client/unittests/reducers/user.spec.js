import user from 'COMPONENTS/reducers/user.js';

describe('user-reducer', () => {
    test('INITIAL_USER', () => {
        const action = {
          type: 'INITIAL_USER',
          status: 'complete',
          data: {
            test: 'test123',
            test2: 'test1234',
          },
          localSettings: {
            test3: '123'
          }
        }

        expect(user(
            {},
            action
        )).toEqual({
            ...action.data,
            ...action.localSettings
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            ...action.data,
            ...action.localSettings,
            test4: '12312534',
        });
    });

    test('REGISTER, SIGNIN', () => {
        const action = {
          type: 'REGISTER',
          status: 'complete',
          data: {
            test2: 'test1234',
            test3: '123'
          }
        }

        expect(user(
            {},
            action
        )).toEqual({
            ...action.data
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            ...action.data,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('SAVE_SETTINGS, SIGNIN', () => {
        const action = {
          type: 'SAVE_SETTINGS',
          status: 'complete',
          data: {
            test: 'test123',
          },
          locally: {
            test2: 'test1234',
            test3: '123'
          }
        }

        expect(user(
            {},
            action
        )).toEqual({
            ...action.locally
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            ...action.locally,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('TRANSACTIONS', () => {
        const action = {
          type: 'TRANSACTIONS',
          status: 'complete',
          data: {
            test: 'test123',
            test2: 'test1234',
          },
        }

        expect(user(
            {},
            action
        ).transactions).toEqual({
            ...action.data
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            transactions: action.data,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).toEqual({
            test4: '12312534',
        });
    });

    test('SIGNOUT', () => {
        const action = {
          type: 'SIGNOUT',
        }

        expect(user(
            {},
            action
        )).toEqual({});
    });

    test('SEND_MONEY', () => {
        const action = {
          type: 'SEND_MONEY',
          status: 'complete',
          amount: 10,
        }

        expect(user(
            {
                balance: 20
            },
            action
        )).toEqual({
            balance: 10
        });

        expect(user(
            {
                test4: '12312534',
                balance: 20
            },
            action
        )).toEqual({
            balance: 10,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534',
                balance: 20
            },
            action
        )).toEqual({
            test4: '12312534',
            balance: 20
        });
    });

    test('default', () => {
        const action = {
            type: 'asdawd',
            status: 'complete',
            id: 1,
        }

        expect(user(
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
