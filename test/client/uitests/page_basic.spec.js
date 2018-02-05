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

    it('should not display the userframe and show the login button', async function() {
        const userframe = await this.driver.findElements(S.userframe)

        expect(userframe).to.have.lengthOf(0);

        expect(await this.driver.findElements(S.ql.login)).to.have.lengthOf(1);
    });

    it('should display the settings quicklink', function() {
        return this.driver.findElement(S.ql.settings)
            .then(element => element.isDisplayed())
            .then(visibile => expect(visibile).to.be.true);
    });
});
