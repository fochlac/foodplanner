import { urlHandler } from 'COMPONENTS/middleware/urlHandler.js';
import { expect } from 'chai';


describe('urlHandler', () => {
  it('should set the history correctly', () => {
    let act = {content: 'test', option: 'test2', title: 'title', url: 'test3'};
    
    global.history.pushState = (data, title, url) => {
        expect(data.app.dialog.type).to.equal(act.content);
        expect(data.app.dialog.option).to.equal(act.option);
        expect(title).to.equal(act.title);
        expect(url).to.equal(act.url);
    }

    urlHandler({getState: () => ({})})((action) => {
    	expect(action).to.deep.equal(act);
    })(act);

    global.history.pushState = undefined;

  });
});