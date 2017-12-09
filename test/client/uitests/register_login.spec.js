import { expect } from 'chai';
import { until } from 'selenium-webdriver';
import { S } from 'T_UI/base_selectors.js';

describe('login area', () => {

    it('should not be logged in', async function() {
        const userframe = await this.driver.findElement(S.userframe)

        userframe.isDisplayed()
            .then(visibile => expect(visibile).to.be.true);

        return userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.not.equal(-1));
    });

    it('should be logged in after registering', async function() {
        this.timeout(5000);

        this.driver.findElement(S.uf.registerLink).click();

        this.driver.findElement(S.uf.registerName).sendKeys(this.username);
        this.driver.findElement(S.uf.registerMail).sendKeys(this.usermail);
        this.driver.findElement(S.uf.submit).click();

        this.driver.awaitBusyComplete();

        const userframe = await this.driver.findElement(S.userframe);

        userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.equal(-1));

        return this.driver.findElement(S.uf.username)
            .then(elem => elem.getText())
            .then(text => expect(text).to.equal(this.username));
    });

    it('should be logged out after logging out', async function() {
        this.timeout(5000);

        this.driver.findElement(S.ql.logout).click();

        this.driver.awaitBusyComplete();

        const userframe = await this.driver.findElement(S.userframe);

        return userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.not.equal(-1));
    });

});