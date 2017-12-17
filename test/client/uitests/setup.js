import { S } from 'T_UI/base_selectors.js';
require("babel-polyfill");
require("./custom_wait_conditions.js");

const fs = require('fs'),
    path = require('path'),
    webdriver = require('selenium-webdriver'),
    chromedriver = require('chromedriver'),
    until = webdriver.until,
    chromeCapabilities = webdriver.Capabilities.chrome();

chromeCapabilities.set('chromeOptions', {args: ['--headless', '--no-sandbox', '--allow-insecure-localhost']});

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

driver
    .manage()
    .window()
    .setSize(1280, 1080);

driver
    .manage()
    .timeouts(10000)
    .pageLoadTimeout(10000);

    driver.scrollToElement = function(element) {
        return driver.executeScript(el => el.scrollIntoView(true), element);
    }

    driver.waitElementLocated = function(predicate) {
    const locator = typeof predicate === 'object' ? predicate : By.css(predicate);

        driver.wait(until.elementLocated(locator));
        return driver.findElement(locator);
    }

    driver.waitElementsLocated = function(predicate) {
    const locator = typeof predicate === 'object' ? predicate : By.css(predicate)

        driver.wait(until.elementsLocated(locator));
        return driver.findElements(locator);
    }

    driver.findElementAndClick = function(predicate) {
        return driver.waitElementLocated(predicate).then(element => element.click() && element);
    }

    driver.findElementAndSendKeys = function(predicate, keys) {
        return driver.waitElementLocated(predicate).then(element => element.sendKeys(keys) && element);
    }

    driver.saveScreenshot = function(name) {
        const targetFile = path.join(process.env.FOOD_TESTS, `${new Date().toISOString()}-${name}`.replace(/[^a-zA-Z0-9]{1,}/g, '-') + '.png')
        return driver.takeScreenshot()
            .then(pngBase64 => Buffer.from(pngBase64, 'base64'))
            .then(png => fs.writeFileSync(targetFile, png));
    }

    driver.awaitBusyComplete = function() {
        driver.wait(until.elementLocated(S.busy), 300)
            .catch(err => null);
        return driver.wait(until.elementIsNotPresent(S.busy));
    }

    driver.refresh = function() {
        driver.executeScript('window.location.reload()');
        driver.wait(until.elementLocated(S.userframe));

        return driver.wait(until.elementIsVisible(driver.findElement(S.userframe)));
    }


before(function() {
    this.timeout(10000);

    if (!this.driver) {
        this.driver = driver;
        this.username = 'testuser';
        this.usermail = 'test@fochlac.com';
        this.path = process.env.FOOD_TESTS + '/client/uitests';
        this.resourcePath = process.env.FOOD_TESTS + '/client/resources';
    }

    this.driver.get(`https://${process.env.FOOD_EXTERNAL}${(process.env.FOOD_EXTERNAL === 'localhost') ? (':' + process.env.FOOD_PORT) : ''}/`);

    return this.driver.wait(until.titleIs('Mittagsplaner'), 10000);
});

after(async function() {
    console.log('quit');
    await this.driver.quit();
});