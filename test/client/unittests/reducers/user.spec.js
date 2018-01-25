import user from 'COMPONENTS/reducers/user.js';
import { expect } from 'chai';

describe('user-reducer', () => {
    it('INITIAL_USER', () => {
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
        )).to.deep.equal({
            ...action.data,
            ...action.localSettings
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            ...action.data,
            ...action.localSettings,
            test4: '12312534',
        });
    });

    it('SAVE_SETTINGS, SIGNIN', () => {
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
        )).to.deep.equal({
            ...action.locally
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            ...action.locally,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            test4: '12312534',
        });
    });

    it('TRANSACTIONS', () => {
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
        ).transactions).to.deep.equal({
            ...action.data
        });

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            transactions: action.data,
            test4: '12312534',
        });

        action.status = 'hidden';

        expect(user(
            {
                test4: '12312534'
            },
            action
        )).to.deep.equal({
            test4: '12312534',
        });
    });

    it('SIGNOUT', () => {
        const action = {
          type: 'SIGNOUT',
        }

        expect(user(
            {},
            action
        )).to.deep.equal({});
    });

    it('SEND_MONEY', () => {
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
        )).to.deep.equal({
            balance: 10
        });

        expect(user(
            {
                test4: '12312534',
                balance: 20
            },
            action
        )).to.deep.equal({
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
        )).to.deep.equal({
            test4: '12312534',
            balance: 20
        });
    });
});