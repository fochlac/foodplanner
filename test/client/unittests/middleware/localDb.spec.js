import { localDb } from 'COMPONENTS/middleware/localDb.js';
import { expect } from 'chai';

let output;

global.indexedDB = {
    open: (dbname, version) => {
        let obj = {};

        setTimeout(() => {
            obj.onsuccess.bind({result: {
                objectStoreNames: {
                    contains: () => true
                },
                transaction: (storage, type) => {
                    return {
                        objectStore: (storage2) => {
                            return {
                                put: ({key, data}) => {
                                    let obj = {};
                                    expect(key).to.equal('user');
                                    output = data;

                                    setTimeout(() => {
                                        obj.onsuccess();
                                    }, 1);

                                    return obj;
                                }
                            }
                        }
                    }
                } 
            }})();
        }, 1);


        return obj;
    }
}

describe('localDb', () => {
  it('should store locally output to local storage as user', (done) => {
    let act1 = {locally: 'test1', actionId: 1},
        act2 = {locally: 'test2', status: 'complete', api: '', actionId: 2};
    

    localDb({})((action) => {
        expect(action).to.deep.equal(act1);
        expect(output).to.equal(act1.locally);
        

        localDb({})((action) => {
            expect(action).to.deep.equal(act2);
            expect(output).to.equal(act2.locally);
            done();
        })(act2);
    })(act1);

  });
});