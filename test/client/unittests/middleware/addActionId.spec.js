import { addActionId } from 'COMPONENTS/middleware/addActionId.js';
import { expect } from 'chai';


describe('addActionId', () => {
  it('should add an action id to each action', () => {
    addActionId()((action) => {
    	expect(action.actionId).to.equal(1);
    })({});

    addActionId()((action) => {
    	expect(action.actionId).to.equal(2);
    })({});

    addActionId()((action) => {
    	expect(action.actionId).to.equal(2);
    })({actionId: 2});

    addActionId()((action) => {
    	expect(action.actionId).to.equal(3);
    })({});
  });
});