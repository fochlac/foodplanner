require('babel-polyfill')
require('./custom_wait_conditions.js')

import { createMeal, createUser, loginState, loginUser, signupUser } from 'T_UI/actions.js'

import { By } from 'selenium-webdriver'
import { S } from 'T_UI/base_selectors.js'

const fs = require('fs'),
  path = require('path'),
  webdriver = require('selenium-webdriver'),
  chromedriver = require('chromedriver'),
  until = webdriver.until,
  chromeCapabilities = webdriver.Capabilities.chrome()

chromeCapabilities.set('chromeOptions', {
  args: ['--headless', '--no-sandbox', '--allow-insecure-localhost'],
})

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .withCapabilities(chromeCapabilities)
  .build()

driver
  .manage()
  .window()
  .setSize(1280, 1080)

driver
  .manage()
  .timeouts(10000)
  .pageLoadTimeout(10000)

driver.scrollToElement = function(element) {
  return driver.executeScript(el => el.scrollIntoView(true), element)
}

driver.waitElementLocated = function(predicate) {
  const locator = typeof predicate === 'object' ? predicate : By.css(predicate)

  driver.wait(until.elementLocated(locator))
  return driver.findElement(locator)
}

driver.waitElementsLocated = function(predicate) {
  const locator = typeof predicate === 'object' ? predicate : By.css(predicate)

  driver.wait(until.elementsLocated(locator))
  return driver.findElements(locator)
}

driver.findElementAndClick = function(predicate) {
  return driver.waitElementLocated(predicate).then(element => element.click() && element)
}

driver.findElementAndSendKeys = function(predicate, keys) {
  return driver.waitElementLocated(predicate).then(element => element.sendKeys(keys) && element)
}

driver.saveScreenshot = function(name) {
  const targetFile = path.join(process.env.FOOD_TESTS, `screenshot-${name ? name : ''}-${new Date().toISOString()}`.replace(/[^a-zA-Z0-9]{1,}/g, '-') + '.png')
  return driver
    .takeScreenshot()
    .then(pngBase64 => Buffer.from(pngBase64, 'base64'))
    .then(png => fs.writeFileSync(targetFile, png))
}

driver.awaitBusyComplete = function() {
  driver.wait(until.elementLocated(S.busy), 300).catch(err => null)
  return driver.wait(until.elementIsNotPresent(S.busy))
}

driver.refresh = async function() {
  if ((await driver.findElements(S.dialog.dialog)).length) {
    await driver.findElement(S.dialog.close).click()
  }

  await driver.findElement(S.reload).click()
  await driver.waitElementLocated('body')
  await driver.sleep(1000)

  if ((await driver.findElements(S.topbar)).length === 0) {
    await driver.refresh()
  }
  await driver.findElement(S.topbar)
}

before(async function() {
  this.timeout(10000)

  if (!this.driver) {
    this.driver = driver
    this.username = 'admin'
    this.usermail = 'admin@test.de'
    this.path = process.env.FOOD_TESTS + '/client/uitests'
    this.resourcePath = process.env.FOOD_TESTS + '/client/resources'

    this.driver.createMeal = createMeal.bind(this)
    this.driver.createUser = createUser.bind(this)
    this.driver.loginState = loginState.bind(this)
    this.driver.loginUser = loginUser.bind(this)
    this.driver.signupUser = signupUser.bind(this)
  }

  this.driver.get(`http://${process.env.FOOD_EXTERNAL}${process.env.FOOD_EXTERNAL === 'localhost' ? ':' + process.env.FOOD_PORT : ''}/1/`)
  console.log('testing against: ' + `http://${process.env.FOOD_EXTERNAL}${process.env.FOOD_EXTERNAL === 'localhost' ? ':' + process.env.FOOD_PORT : ''}/1/`)
  return this.driver.wait(until.titleIs('Mittagsplaner'), 10000)
})

afterEach(async function() {
  if (this.currentTest.state === 'failed') {
    await this.driver.saveScreenshot()
  }
})

after(async function() {
  await this.driver.quit()
})
