import { expect } from 'chai';
import { until } from 'selenium-webdriver';
import { S } from 'T_UI/base_selectors.js';

describe('open page and check state', () => {

    it('should show the page title "Mittagsplaner"', function() {
        return this.driver.getTitle()
            .then(title => expect(title).to.equal('Mittagsplaner'));
    });

    it('should display the topbar', function() {
        return this.driver.findElement(S.topbar)
            .then(element => element.isDisplayed())
            .then(visibile => expect(visibile).to.be.true);
    });

    it('should display the dashboard', function() {
        return this.driver.findElement(S.dashboard)
            .then(element => element.isDisplayed())
            .then(visibile => expect(visibile).to.be.true);
    });

    it('should display the userframe as register frame', async function() {
        const userframe = await this.driver.findElement(S.userframe)

        userframe.isDisplayed()
            .then(visibile => expect(visibile).to.be.true);

        return userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.not.equal(-1));
    });

    it('should display the settings quicklink', function() {
        return this.driver.findElement(S.ql.settings)
            .then(element => element.isDisplayed())
            .then(visibile => expect(visibile).to.be.true);
    });
});