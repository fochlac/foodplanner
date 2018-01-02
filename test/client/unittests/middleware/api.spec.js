import { apiMiddleware } from 'COMPONENTS/middleware/api.js';
import { expect } from 'chai';
const myfetch = global.fetch;

describe('api', () => {
  it('should set the history correctly', async function() {
    let act = {
            type: 'test',
            status: 'initialized',
            api: {
                method: 'get',
                url: 'testurl',
                body: {test: 'test123'}
            },
            enqueue: () => 'test123'
        },
        act2 = {
            type: 'test2',
            status: 'hidden',
            api: {
                headers: 'formdata',
                method: 'get',
                url: 'testurl2',
                body: {test: 'test1232'}
            }
        };


    global.fetch = (url, options) => {
        expect(url).to.equal(act.api.url);
        expect(options.method).to.equal(act.api.method);
        expect(options.headers.Accept).to.equal('application/json');
        expect(options.headers['Content-Type']).to.equal('application/json');
        expect(options.body).to.equal(JSON.stringify(act.api.body));

        return Promise.resolve({
            status: 200, 
            headers: {get: () => (Date.now() - 1500)},
            json: () => Promise.resolve('test1')
        });
    }

    await new Promise((resolve) => {
        apiMiddleware({dispatch: action => {
            if (action.type === act.type) {
                expect(action.status).to.equal('complete');
                expect(action.data).to.equal('test1');
            } else {
                expect(action).to.equal('test123');
                resolve();
            }
        }})((action) => {
            expect(action).to.deep.equal(act);
        })(act);
    });

    global.fetch = (url, options) => {
        expect(url).to.equal(act2.api.url);
        expect(options.method).to.equal(act2.api.method);
        expect(options.body).to.deep.equal(act2.api.body);
        expect(options.headers.Accept).to.equal('application/json');
        expect(options.headers['Content-Type']).to.equal(undefined);

        return Promise.resolve({
            status: 200, 
            headers: {get: () => (Date.now() - 1500)},
            json: () => Promise.resolve('test1')
        });
    }

    await new Promise((resolve) => {

        apiMiddleware({dispatch: action => {
            expect(action.status).to.equal('complete');
            expect(action.data).to.equal('test1');
            resolve();
        }})((action) => {
            expect(action).to.deep.equal(act2);
        })(act2);
    });

    global.fetch = myfetch;
  });
});
