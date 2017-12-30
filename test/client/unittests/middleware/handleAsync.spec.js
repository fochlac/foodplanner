import { handleAssync } from 'COMPONENTS/middleware/handleAssync.js';
import { set_busy, set_hidden_busy } from 'COMPONENTS/actions.js';
import { expect } from 'chai';


describe('handleAssync', () => {
  it('should set busy state correctly', () => {
    let act1 = {status: 'initialized', actionId: 1},
        act1c = {status: 'complete', actionId: 1},
        act2 = {status: 'initialized', actionId: 2},
        act2c = {status: 'complete', actionId: 2},
        act3 = {status: 'hidden', actionId: 3},
        act3c = {status: 'complete', actionId: 3},
        act4 = {status: 'hidden', actionId: 4},
        act4c = {status: 'complete', actionId: 4};
    

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_busy(true));
    }})((action) => {
        expect(action).to.deep.equal(act1);
    })(act1);

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_busy(false));
    }})((action) => {
    	expect(action).to.deep.equal(act1c);
    })(act1c);

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_busy(true));
    }})((action) => {
        expect(action).to.deep.equal(act1);
    })(act1);

    handleAssync({dispatch: action => {
        expect(0, 'should not be called!').to.deep.equal(1);
    }})((action) => {
        expect(action).to.deep.equal(act2);
    })(act2);

    handleAssync({dispatch: action => {
        expect(0, 'should not be called!').to.deep.equal(1);
    }})((action) => {
        expect(action).to.deep.equal(act1c);
    })(act1c);

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_busy(false));
    }})((action) => {
        expect(action).to.deep.equal(act2c);
    })(act2c);

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_hidden_busy(true));
    }})((action) => {
        expect(action).to.deep.equal(act3);
    })(act3);

    handleAssync({dispatch: action => {
        expect(0, 'should not be called!').to.deep.equal(1);
    }})((action) => {
        expect(action).to.deep.equal(act4);
    })(act4);

    handleAssync({dispatch: action => {
        expect(0, 'should not be called!').to.deep.equal(1);
    }})((action) => {
        expect(action).to.deep.equal(act3c);
    })(act3c);

    handleAssync({dispatch: action => {
        expect(action).to.deep.equal(set_hidden_busy(false));
    }})((action) => {
        expect(action).to.deep.equal(act4c);
    })(act4c);

  });
});