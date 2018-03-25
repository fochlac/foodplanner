import { Key, until } from 'selenium-webdriver'

import { S } from 'T_UI/base_selectors.js'
import { expect } from 'chai'
import { open } from 'fs'

require('./meal.spec.js')

const openPriceDialog = async function() {
  this.driver.findElement(S.db.m.pay).click()

  return this.driver.waitElementLocated(S.dialog.price)
}

const sendMoney = async function(mail, amount) {
  await this.driver.findElement(S.uf.sendMoney).click()

  const dialog = await this.driver.waitElementLocated(S.dialog.sendMoney)
  const money = await dialog.findElement(S.sMd.money)
  const mailInput = await dialog.findElement(S.sMd.mail)

  await mailInput.clear()
  await mailInput.sendKeys(mail.slice(0, -2))
  await this.driver.wait(until.elementValueIs(mailInput, mail))
  await money.clear()
  await money.sendKeys(amount)
  await this.driver.wait(until.elementValueIs(money, amount.toString()))

  await dialog.findElement(S.dialog.submit).click()
  await this.driver.awaitBusyComplete()
}

const USER1 = { mail: 'test@test.de', name: 'testuser1' }
const USER2 = { mail: 'test2@test.de', name: 'testuser2' }

describe('payment dialog', () => {
  before(async function() {
    this.timeout(20000)
    this.openPriceDialog = openPriceDialog.bind(this)
    this.sendMoney = sendMoney.bind(this)

    await this.driver.createUser(USER1)
    await this.driver.createUser(USER2)

    await this.driver.createMeal({
      options: [
        {
          name: 'test1',
          type: 'Anzahl',
          values: ['test1a', 'test2a', 'test3a'],
        },
        {
          name: 'test2',
          type: 'Auswahl',
          values: ['test1b', 'test2b', 'test3b'],
        },
        {
          name: 'test3',
          type: 'Ja-Nein',
        },
      ],
    })
  })

  it('should set the prices correctly', async function() {
    this.timeout(5000)

    const mealElems = await this.driver.findElements(S.db.meal)
    expect(mealElems.length).to.equal(1)

    let dialog = await this.openPriceDialog()
    let priceInputs = await this.driver.findElements(S.pd.priceInputs)

    priceInputs[0].clear()
    priceInputs[0].sendKeys(1)
    priceInputs[1].clear()
    priceInputs[1].sendKeys(0.1)
    priceInputs[2].clear()
    priceInputs[2].sendKeys(0.3)
    priceInputs[3].clear()
    priceInputs[3].sendKeys(0.5)
    priceInputs[4].clear()
    priceInputs[4].sendKeys(0.7)
    priceInputs[5].clear()
    priceInputs[5].sendKeys(0.9)
    priceInputs[7].clear()
    priceInputs[7].sendKeys(10)

    await this.driver.findElement(S.dialog.submit).click()
    await this.driver.awaitBusyComplete()

    dialog = await this.openPriceDialog()
    priceInputs = await this.driver.findElements(S.pd.priceInputs)

    expect(await priceInputs[0].getAttribute('value')).to.equal('1.00')
    expect(await priceInputs[1].getAttribute('value')).to.equal('0.10')
    expect(await priceInputs[2].getAttribute('value')).to.equal('0.30')
    expect(await priceInputs[3].getAttribute('value')).to.equal('0.50')
    expect(await priceInputs[4].getAttribute('value')).to.equal('0.70')
    expect(await priceInputs[5].getAttribute('value')).to.equal('0.90')
    expect(await priceInputs[7].getAttribute('value')).to.equal('10.00')

    await dialog.findElement(S.dialog.cancel).click()
  })

  it('should send money correctly', async function() {
    this.timeout(20000)

    await this.driver.loginUser(this.usermail)

    // total price: 1 + 0.1 * 2 + 0.9 + 10 = 12.1
    await this.driver.signupUser({
      options: [
        {
          name: 'test1',
          type: 'Anzahl',
          value: 'test1a',
          count: 2,
        },
        {
          name: 'test2',
          type: 'Auswahl',
          value: 'test2b',
        },
        {
          name: 'test3',
          type: 'Ja-Nein',
          show: 1,
        },
      ],
    })

    await this.sendMoney(USER2.mail, 100)
    await this.sendMoney(USER1.mail, 100)

    await this.driver.loginUser(USER2.mail)

    await this.driver.refresh()

    expect(await this.driver.findElement(S.uf.balance).getText()).to.equal('100.00')
  })

  it('should lock the prices and calculate them correctly', async function() {
    this.timeout(5000)
    let dialog = await this.openPriceDialog()
    await dialog.findElement(S.pd.finalize).click()
    await this.driver.awaitBusyComplete()
    expect(await this.driver.findElement(S.pd.price).getText()).to.include('12.10')
    expect(await this.driver.findElement(S.pd.state).findElements(S.pd.unpaid)).to.have.lengthOf(1)

    await dialog.findElement(S.dialog.cancel).click()
  })

  it('should get payment', async function() {
    this.timeout(20000)

    await this.driver.loginUser(USER1.mail)

    // total price: 1 + 0.5 * 2 + 0.7 + 0 = 2.7
    await this.driver.signupUser({
      options: [
        {
          name: 'test1',
          type: 'Anzahl',
          value: 'test3a',
          count: 2,
        },
        {
          name: 'test2',
          type: 'Auswahl',
          value: 'test1b',
        },
        {
          name: 'test3',
          type: 'Ja-Nein',
          show: 0,
        },
      ],
    })

    await this.driver.loginUser(USER2.mail)
    await this.driver.findElement(S.db.m.edit).click()
    await this.driver.waitElementLocated(S.dialog.meal)
    await this.driver.findElement(S.cm.deadline).click()
    await this.driver.findElement(S.cm.today).click()
    await this.driver
      .findElement(S.cm.deadlineTime)
      .findElement(S.optionByName('00:00'))
      .click()
    await this.driver.findElement(S.dialog.submit).click()
    await this.driver.awaitBusyComplete()

    await this.openPriceDialog()
    let rows = await this.driver.findElements(S.pd.signups)
    expect(rows).to.have.lengthOf(3)
    expect(await rows[2].findElement(S.pd.price).getText()).to.include('2.70')
    expect(await rows[2].findElement(S.pd.state).findElements(S.pd.unpaid)).to.have.lengthOf(1)
    await this.driver.findElement(S.pd.finalize).click()
    await this.driver.awaitBusyComplete()
    rows = await this.driver.findElements(S.pd.signups)
    expect(await rows[1].findElement(S.pd.state).findElements(S.pd.paid)).to.have.lengthOf(1)
    expect(await rows[2].findElement(S.pd.state).findElements(S.pd.paid)).to.have.lengthOf(1)
    await this.driver.findElement(S.dialog.cancel).click()
    await this.driver.refresh()
    expect(await this.driver.findElement(S.uf.balance).getText()).to.equal('114.80')
  })

  after(async function() {
    this.timeout(5000)
    await this.driver.findElement(S.db.m.delete).click()
    await this.driver.waitElementLocated(S.dialog.submit).click()
    await this.driver.awaitBusyComplete()
  })
})
