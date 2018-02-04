require("babel-polyfill");

import { S } from "T_UI/base_selectors.js";
import { expect } from "chai";
import { Key, until } from "selenium-webdriver";

export const loginState = async function() {
  const userframe = await this.driver.findElements(S.userframe);

  return !!userframe.length;
};

export const createUser = async function({ mail, name = "testuser", pass }) {
  if (await this.driver.loginState()) {
    await this.driver.findElement(S.ql.logout).click();
    await this.driver.awaitBusyComplete();
  }

  this.driver.findElement(S.ql.login).click();
  this.driver.waitElementLocated(S.dialog.login);
  this.driver.findElement(S.ld.registerLink).click()


  await this.driver.findElement(S.ld.name).sendKeys(name);
  await this.driver.findElement(S.ld.mail).sendKeys(mail);
  if (pass) {
    await this.driver.findElement(S.ld.pass).sendKeys(pass);
    await this.driver.findElement(S.ld.pass2).sendKeys(pass);

  }
  await this.driver.findElement(S.dialog.submit).click();
  await this.driver.awaitBusyComplete();
};

export const loginUser = async function(mail, pass) {
  if (await this.driver.loginState()) {
    await this.driver.findElement(S.ql.logout).click();
    await this.driver.awaitBusyComplete();
  }

  this.driver.findElement(S.ql.login).click();
  this.driver.waitElementLocated(S.dialog.login);

  await this.driver.findElement(S.ld.mail).sendKeys(mail);
  if (pass && pass.length && typeof pass === 'string') {
    await this.driver.findElement(S.ld.pass).sendKeys(pass);
    await this.driver.findElement(S.ld.pass2).sendKeys(pass);
  }
  await this.driver.findElement(S.dialog.submit).click();
  await this.driver.awaitBusyComplete();

  expect(await this.driver.loginState()).to.be.true;
};

export const signupUser = async function({
  comment = 'Lorem ipsum dolor sit amet',
  options = [],
}) {
  let dialog = await this.driver.findElements(S.dialog.signup);
  if (!dialog.length) {
    await this.driver.findElement(S.db.m.signup).click();
    dialog = await this.driver.waitElementLocated(S.dialog.signup);
  } else {
    dialog = dialog[0];
  }

  await this.driver.findElement(S.su.commentInput).sendKeys(comment);
  await Promise.all(options.map(async (option, index) => {
    const optionElem = await dialog.findElement(S.su.optionByName(option.name));

    switch(option.type) {
        case 'Anzahl':
            await optionElem.findElement(S.su.count).sendKeys(option.count);
        case 'Auswahl':
            await optionElem.findElement(S.su.select).findElement(S.su.signupOptionByName(option.value)).click();
            break;
        case 'Ja-Nein':
            await (await optionElem.findElements(S.su.yesno))[option.show ? 0 : 1].click();
            break;
    }
  }));
  await this.driver.findElement(S.dialog.submit).click();
  await this.driver.awaitBusyComplete();
};

export const createMeal = async function({
  name = "testmeal",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum mi a molestie aliquam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  signupLimit = 0,
  time,
  deadline,
  image,
  options = []
}) {
  await this.driver.findElement(S.ql.meal).click();
  await this.driver.waitElementLocated(S.dialog.meal);

  const [
    nameInput,
    imageInput,
    descriptionInput,
    signupInput
  ] = await Promise.all(
    [S.cm.name, S.cm.imageInput, S.cm.description, S.cm.signup].map(selector =>
      this.driver.findElement(selector)
    )
  );

  nameInput.clear();
  nameInput.sendKeys(name);
  if (image) {
    imageInput.sendKeys(this.resourcePath + image);
  }
  descriptionInput.clear();
  descriptionInput.sendKeys(description);
  signupInput.clear();
  signupInput.sendKeys(signupLimit);

  await this.driver.waitElementLocated(S.cm.image);
  await this.driver.wait(until.elementValueIs(nameInput, name), 1000);
  await this.driver.wait(
    until.elementValueIs(descriptionInput, description),
    1000
  );
  await this.driver.wait(
    until.elementValueIs(signupInput, signupLimit.toString()),
    1000
  );

  await Promise.all(options.map(addMealOption.bind(this)));
  await this.driver.findElement(S.dialog.submit).click();
  await this.driver.awaitBusyComplete();
};

const addMealOption = async function(option, index) {
  this.driver.findElement(S.cm.addOpt).click();

  const elem = (await this.driver.findElements(S.cm.option))[index];
  const O = S.cm.opt,
    name = await elem.findElement(O.name),
    type = await elem.findElement(O.type);

  let values = await elem.findElements(O.deleteAllValues);

  while (values.length) {
    values[0].click();
    values = await elem.findElements(O.deleteAllValues);
  }

  expect(await elem.findElements(O.deleteAllValues)).to.have.lengthOf(0);

  await type.sendKeys(option.type, Key.RETURN);
  await name.clear();
  await name.sendKeys(option.name);

  if (option.values) {
    const value = await elem.findElement(O.value),
      add = await elem.findElement(O.add);

    option.values.forEach(
      async function(val) {
        value.sendKeys(val);
        add.click();
        await this.driver.waitElementLocated(O.deleteValue(val));
      }.bind(this)
    );

    return this.driver.wait(
      until.elementCountIs(option.values.length, O.deleteAllValues, elem),
      5000
    );
  } else {
    return this.driver.wait(until.elementValueIs(name, option.name), 5000);
  }
};
