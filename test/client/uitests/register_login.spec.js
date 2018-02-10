import { S } from "T_UI/base_selectors.js";
import { expect } from "chai";
import { until } from "selenium-webdriver";

require("./page_basic.spec.js");

const checkLoggedin = async function() {
  const userframe = await this.driver.findElements(S.userframe);

  expect(userframe).to.have.lengthOf(1);

  return this.driver
  .findElement(S.uf.username)
      .then(elem => elem.getText())
      .then(text => expect(text).to.equal(this.username));
    },
    checkLoggedOut = async function() {
      const userframe = await this.driver.findElements(S.userframe);

      expect(userframe).to.have.lengthOf(0);
  };

describe("login area", () => {
  before(function() {
    this.checkLoggedin = checkLoggedin.bind(this);
    this.checkLoggedOut = checkLoggedOut.bind(this);
  });

  it("should not be logged in", async function() {
    return this.checkLoggedOut();
  });

  it("should be logged in after registering", async function() {
    this.timeout(5000);

    await this.driver.createUser({ name: this.username, mail: this.usermail });

    const userframe = await this.driver.findElement(S.userframe);

    return this.checkLoggedin();
  });

  it("should be logged out after logging out", async function() {
    this.timeout(5000);

    this.driver.findElement(S.ql.logout).click();

    this.driver.awaitBusyComplete();

    return this.checkLoggedOut();
  });

  it("should be unable to register with same email", async function() {
    this.timeout(10000);

    await this.driver.findElement(S.ql.login).click();
    await this.driver.waitElementLocated(S.dialog.login);
    await this.driver.findElement(S.ld.registerLink).click()

    await this.driver.findElement(S.ld.name).sendKeys(this.username);
    await this.driver.findElement(S.ld.mail).sendKeys(this.usermail);
    await this.driver.findElement(S.dialog.submit).click();
    await this.driver.awaitBusyComplete();

    await this.driver.waitElementLocated(S.db.error);
    await this.driver.findElement(S.db.closeError).click();
    await this.driver.wait(until.elementIsNotPresent(S.db.error));

    await this.driver.findElement(S.dialog.close).click();
    await this.driver.wait(until.elementIsNotPresent(S.dialog.login));

    return this.checkLoggedOut();
  });

  it("should be unable to login with wrong mail", async function() {
    this.timeout(5000);

    this.driver.findElement(S.ql.login).click()
    this.driver.waitElementLocated(S.dialog.login)

    await this.driver.findElement(S.ld.mail).sendKeys("2test@web.de");

    await this.driver.findElement(S.dialog.submit).click();
    await this.driver.awaitBusyComplete();

    this.checkLoggedOut();

    await this.driver.findElement(S.dialog.close).click();
    await this.driver.wait(until.elementIsNotPresent(S.dialog.login));
  });

  it("should be able to login with registerd email", async function() {
    this.timeout(5000);

    await this.driver.loginUser(this.usermail);
    await this.driver.awaitBusyComplete();

    return this.checkLoggedin();
  });

  it("should remain logged in on page refresh", async function() {
    this.timeout(10000);

    await this.driver.refresh();

    await this.checkLoggedin();
  });
});
