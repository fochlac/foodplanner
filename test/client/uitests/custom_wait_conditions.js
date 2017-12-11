const webdriver = require('selenium-webdriver'),
    { Condition } = require('selenium-webdriver/lib/webdriver'),
    until = webdriver.until,
    By = webdriver.By;

until.elementIsNotPresent = function elementIsNotPresent(locator) {
  return new Condition('for no element to be located ' + locator, function(driver) {
    return driver.findElements(locator).then(function(elements) {
      return elements.length == 0;
    });
  });
};

until.elementValueIs = function elementIsNotPresent(element, value) {
  return new Condition('for element value to be ' + value, function(driver) {
      return element.getAttribute('value').then(val => val === value);
  });
};

until.elementCountIs = function elementIsNotPresent(count, selector, parent) {
  return new Condition('for number of found elements to be ' + count, async function(driver) {
      const targets = await (parent ? parent : driver).findElements(selector);
      return +count === targets.length;
  });
};