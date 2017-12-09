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