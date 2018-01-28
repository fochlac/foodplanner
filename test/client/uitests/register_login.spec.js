import { expect } from 'chai';
import { until } from 'selenium-webdriver';
import { S } from 'T_UI/base_selectors.js';

require('./page_basic.spec.js');

const checkLoggedin = async function() {
        const userframe = await this.driver.findElement(S.userframe);

        userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.equal(-1));

        return this.driver.findElement(S.uf.username)
            .then(elem => elem.getText())
            .then(text => expect(text).to.equal(this.username));
    },
    checkLoggedOut = async function() {
        const userframe = await this.driver.findElement(S.userframe);

        return userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.not.equal(-1));
    };


describe('login area', () => {

    before(function() {
        this.checkLoggedin = checkLoggedin.bind(this);
        this.checkLoggedOut = checkLoggedOut.bind(this);
    });

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

        return this.checkLoggedin();
    });

    it('should be logged out after logging out', async function() {
        this.timeout(5000);

        this.driver.findElement(S.ql.logout).click();

        this.driver.awaitBusyComplete();

        return this.checkLoggedOut();
    });

    it('should be unable to register with same email', async function() {
        this.timeout(5000);

        this.driver.findElement(S.uf.registerLink).click();

        this.driver.findElement(S.uf.registerName).sendKeys(this.username);
        this.driver.findElement(S.uf.registerMail).sendKeys(this.usermail);
        this.driver.findElement(S.uf.submit).click();

        this.driver.awaitBusyComplete();

        this.driver.waitElementLocated(S.db.error).findElement(S.db.closeError).click();

        return this.checkLoggedOut();
    });

    it('should be unable to login with wrong mail', async function() {
        this.timeout(5000);
        const email = await this.driver.findElement(S.uf.loginMail);

        email.sendKeys('2test@web.de');
        this.driver.findElement(S.uf.submit).click();
        this.checkLoggedOut();

        this.driver.sleep(500);

        return email.clear();
    });

    it('should be able to login with registerd email by typing first 5 letters', async function() {
        this.timeout(5000);
        const submit = await this.driver.waitElementLocated(S.uf.submit);
        const email = await this.driver.waitElementLocated(S.uf.loginMail);
        email.clear();
        email.sendKeys(this.usermail.slice(0,5));
        this.driver.wait(until.elementValueIs(email, this.usermail));
        submit.click();

        await this.driver.awaitBusyComplete();
        return this.checkLoggedin();
    });

    it('should remain logged in on page refresh', async function() {
        this.timeout(5000);

        await this.driver.refresh();

        await this.checkLoggedin();
    });
});