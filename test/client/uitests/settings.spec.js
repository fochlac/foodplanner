import { expect } from 'chai';
import { until } from 'selenium-webdriver';
import { S } from 'T_UI/base_selectors.js';

require('./register_login.spec.js');

const checkLoggedin = async function(name) {
        const userframe = await this.driver.findElement(S.userframe);

        userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.equal(-1));

        return this.driver.findElement(S.uf.username)
            .then(elem => elem.getText())
            .then(text => expect(text).to.equal(name));
    },
    checkLoggedOut = async function() {
        const userframe = await this.driver.findElement(S.userframe);

        return userframe.getAttribute('class')
            .then(className => expect(className.indexOf('register')).to.not.equal(-1));
    },
    openSettingsDialog = async function(option) {
        this.driver.findElement(S.ql.settings).click();

        return this.driver.waitElementLocated(S.dialog.settings);
    };


describe('settings dialog', () => {

    before(function() {
        this.checkLoggedin = checkLoggedin.bind(this);
        this.checkLoggedOut = checkLoggedOut.bind(this);
        this.openSettingsDialog = openSettingsDialog.bind(this);
    });



    it('name and mail in settings dialog should be correct', async function() {
        this.timeout(5000);

        await this.openSettingsDialog();

        this.driver.wait(until.elementValueIs(await this.driver.findElement(S.sd.name), this.username));
        this.driver.wait(until.elementValueIs(await this.driver.findElement(S.sd.mail), this.usermail));
    });

    it('should save changed name and mail', async function() {
        this.timeout(10000);

        const nameInput = await this.driver.findElement(S.sd.name);
        const mailInput = await this.driver.findElement(S.sd.mail);


        await nameInput.clear();
        await nameInput.sendKeys(2 + this.username);
        await mailInput.clear();
        await mailInput.sendKeys(2 + this.usermail);

        await this.driver.findElement(S.dialog.submit).click();

        await this.driver.awaitBusyComplete();

        expect(await this.driver.findElements(S.dialog.settings)).to.have.lengthOf(0);

        await this.driver.findElement(S.uf.username)
            .then(elem => elem.getText())
            .then(text => expect(text).to.equal(2 + this.username));

        this.driver.findElement(S.ql.logout).click();

        await this.driver.refresh();
    });

    it('should be able to login with changed email by typing first 5 letters', async function() {
        this.timeout(5000);
        const submit = await this.driver.waitElementLocated(S.uf.submit);
        const email = await this.driver.waitElementLocated(S.uf.loginMail);
        email.clear();
        email.sendKeys( 2 + this.usermail.slice(0,5));
        this.driver.wait(until.elementValueIs(email, 2 + this.usermail));
        submit.click();

        await this.driver.awaitBusyComplete();
        return this.checkLoggedin(2 + this.username);
    });

    after(async function() {
        this.timeout(5000);
        await this.openSettingsDialog();

        const nameInput = await this.driver.findElement(S.sd.name);
        const mailInput = await this.driver.findElement(S.sd.mail);

        await nameInput.clear();
        await nameInput.sendKeys(this.username);
        await mailInput.clear();
        await mailInput.sendKeys(this.usermail);

        await this.driver.findElement(S.dialog.submit).click();

        await this.driver.awaitBusyComplete();

        expect(await this.driver.findElements(S.dialog.settings)).to.have.lengthOf(0);

        await this.driver.findElement(S.uf.username)
            .then(elem => elem.getText())
            .then(text => expect(text).to.equal(this.username));

    });
});