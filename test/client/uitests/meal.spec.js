import { expect } from 'chai';
import { until, Key } from 'selenium-webdriver';
import { S } from 'T_UI/base_selectors.js';

require('./register_login.spec.js');

const setDay = async function(day) {
        const DayPicker = await this.driver.findElement(S.cm.daypicker),
            dayElem = await DayPicker.findElement(S.cm.day(day));

        dayElem.click();
        return this.driver.wait(until.elementIsNotPresent(S.cm.daypicker));
    },
    setOption =  async function(elem, option) {
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

            option.values.forEach((async function(val){
                value.sendKeys(val);
                add.click();
                await this.driver.waitElementLocated(O.deleteValue(val));
            }).bind(this));

            return this.driver.wait(until.elementCountIs(3, O.deleteAllValues, elem), 5000);
        } else {
            return this.driver.wait(until.elementValueIs(name, option.name), 5000);
        }
    },
    checkOption =  async function(elem, option) {
        const O = S.cm.opt,
            name = await elem.findElement(O.name).getAttribute('defaultValue'),
            type = await elem.findElement(O.type).getAttribute('value');

        expect(name).to.equal(option.name, 'option name');
        expect(await elem.findElement(O.typeOptionByValue(type)).getText()).to.equal(option.type, 'option type');

        if (option.values) {
            await Promise.all(option.values.map(async val => elem.findElements(O.deleteValue(val))));
        }
    },
    addOption = function(edit) {
        return async function(option, index) {
            if (!edit) {
                this.driver.findElement(S.cm.addOpt).click();
            }

            const options = await this.driver.findElements(S.cm.option);
            return this.setOption(options[index], option);
        }.bind(this);
    },
    openMealDialog = async function(option) {
        this.driver.findElement(S.ql.meal).click();

        return this.driver.waitElementLocated(S.dialog.meal);
    },
    openSignupDialog = async function(option) {
        this.driver.findElement(S.db.m.signup).click();

        return this.driver.waitElementLocated(S.dialog.signup);
    },
    setupMeal = async function(meal, edit = false) {
        const elems = await Promise.all([S.cm.name, S.cm.imageInput, S.cm.description, S.cm.signup].map(selector => this.driver.findElement(selector))),
            name = elems[0],
            imageInput = elems[1],
            description = elems[2],
            signup = elems[3];
        name.clear();
        name.sendKeys(meal.name);
        imageInput.sendKeys(this.path + meal.image);
        description.clear();
        description.sendKeys(meal.description);
        signup.clear();
        signup.sendKeys(meal.participants);

        await this.driver.waitElementLocated(S.cm.image);
        await this.driver.wait(until.elementValueIs(name, meal.name), 1000);
        await this.driver.wait(until.elementValueIs(description, meal.description), 1000);
        await this.driver.wait(until.elementValueIs(signup, meal.participants.toString()), 1000);

        return Promise.all(meal.options.map(this.addOption(edit)))
            .then(() => {
                this.driver.findElement(S.dialog.submit).click();
            });
    },
    testMeal = async function(elem, meal) {
        const titleIcons = await elem.findElements(S.db.m.icons),
            image = await elem.findElements(S.db.m.image),
            signupLimit = await elem.findElement(S.db.m.signupLimit).getText(),
            name = await elem.findElement(S.db.m.name).getText(),
            description = await elem.findElement(S.db.m.description).getText(),
            creator = await elem.findElement(S.db.m.creator).getText();

        expect(titleIcons.length).to.equal(3);
        expect(image.length).to.equal(meal.image ? 1 : 0);
        expect(creator).to.equal(this.username);
        expect(name).to.equal(meal.name);
        expect(description).to.equal(meal.description ? meal.description : '');
        if (meal.participants) {
            expect(+signupLimit).to.equal(meal.participants);
        }
    },
    checkSignupOptions = (elem, options) => {
        return Promise.all(options.map(async (option) => {
            const optionElem = await elem.findElement(S.su.optionByName(option.name));

                switch(option.type) {
                    case 'Anzahl':
                        expect((await optionElem.findElements(S.su.count)).length).to.equal(1);
                    case 'Auswahl':
                        const selectOptions = await optionElem.findElements(S.su.selectOptions);

                        expect(selectOptions.length).to.equal(option.values.length);
                        await Promise.all(selectOptions.map(optElem => optElem.getText().then(text => expect(option.values.includes(text)).to.be.true)));
                        break;
                    case 'Ja-Nein':
                        expect((await optionElem.findElements(S.su.yesno)).length).to.equal(2);
                        break;
                }
        }));
    };

const meal = {
        name: 'test1',
        participants: 3,
        description: 'test test test test',
        image: '/testimage.jpg',
        options: [
            {
                name: 'test1',
                type: 'Anzahl',
                values: ['test1a', 'test2a', 'test3a']
            },
            {
                name: 'test2',
                type: 'Auswahl',
                values: ['test1b', 'test2b', 'test3b']
            },
            {
                name: 'test3',
                type: 'Ja-Nein'
            }
        ]
    },
    meal2 = {
        name: 'test1a',
        participants: 5,
        description: 'asda asda asda',
        image: '/testimage.jpg',
        options: [
            {
                name: 'test1a',
                type: 'Anzahl',
                values: ['test2a', 'test4a', 'test63a']
            },
            {
                name: 'test2a',
                type: 'Auswahl',
                values: ['test3b', 'test5b', 'test7b']
            },
            {
                name: 'test3a',
                type: 'Ja-Nein'
            }
        ]
    },
    meal3 = {
        name: 'test1a',
        participants: 5,
        description: 'asda asda asda',
        image: '/testimage.jpg',
        options: []
    }


describe('create meal', () => {
    before(function() {
        this.setupMeal = setupMeal.bind(this);
        this.testMeal = testMeal.bind(this);
        this.setOption = setOption.bind(this);
        this.addOption = addOption.bind(this);
        this.openMealDialog = openMealDialog.bind(this);
        this.openSignupDialog = openSignupDialog.bind(this);
        this.checkSignupOptions = checkSignupOptions.bind(this);
    });

    it('should create a meal using the provided options', async function() {
        this.timeout(20000);

        await this.openMealDialog();
        await this.setupMeal(meal);

        await this.driver.awaitBusyComplete();
        await this.driver.wait(until.elementCountIs(1, S.db.meal), 5000);
        const dialog = await this.driver.findElements(S.dialog.meal),
            mealElems = await this.driver.findElements(S.db.meal);

        expect(dialog.length).to.equal(0);
        expect(mealElems.length).to.equal(1);

        await this.testMeal(mealElems[0], meal);
    });

    it('should display meal options on signup', async function() {
        this.timeout(5000);
        const dialog = await this.openSignupDialog();
        await this.checkSignupOptions(dialog, meal.options);
        dialog.findElement(S.dialog.cancel).click();
        await this.driver.wait(until.elementIsNotPresent(S.dialog.signup));
    });

    after(async function() {
        this.timeout(5000);
        const dialog = await this.driver.findElements(S.dialog.dialog);
        if (dialog.length) {
            dialog[0].findElement(S.dialog.cancel).click();
            await this.driver.wait(until.elementIsNotPresent(S.dialog.dialog));
        }
    });
});

describe('edit meal', () => {
    before(function() {
        this.testMeal = testMeal.bind(this);
        this.addOption = addOption.bind(this);
        this.setOption = setOption.bind(this);
        this.setupMeal = setupMeal.bind(this);
        this.checkOption = checkOption.bind(this);
        this.openMealDialog = openMealDialog.bind(this);
        this.openSignupDialog = openSignupDialog.bind(this);
        this.checkSignupOptions = checkSignupOptions.bind(this);
    });

    it('should display the meal options in the dialog', async function() {
        this.timeout(20000);

        await this.driver.findElement(S.db.getMealByName(meal.name)).findElement(S.db.m.edit).click();
        await this.driver.waitElementLocated(S.dialog.submit);

        const elems = await Promise.all([S.cm.name, S.cm.image, S.cm.description, S.cm.signup].map(selector => this.driver.findElement(selector).catch(() => undefined))),
            name = elems[0].getAttribute('defaultValue'),
            image = elems[1],
            description = elems[2].getAttribute('defaultValue'),
            signup = elems[3].getAttribute('defaultValue');


        expect(await name).to.equal(meal.name, 'meal.name');
        expect(await description).to.equal(meal.description, 'meal.description');
        expect(await signup).to.equal(meal.participants.toString(), 'meal.participants');
        if (meal.image) {
            expect(image).to.not.equal(undefined);
            expect(await image.getAttribute('src'), 'testing product image src').to.not.include('undefined');
        }

        const options = await this.driver.findElements(S.cm.option);
        return Promise.all(meal.options.map((option, index) => this.checkOption(options[index], option)));
    });

    it('should display the changed settings after submitting', async function() {
        this.timeout(20000);

        await this.setupMeal(meal2, true);

        await this.driver.awaitBusyComplete();
        await this.driver.wait(until.elementCountIs(1, S.db.meal), 5000);
        const dialog = await this.driver.findElements(S.dialog.meal),
            mealElems = await this.driver.findElements(S.db.meal);

        expect(dialog.length).to.equal(0);
        expect(mealElems.length).to.equal(1);

        await this.testMeal(mealElems[0], meal2);
    });

    it('should display the changed meal options on signup', async function() {
        this.timeout(5000);
        const dialog = await this.openSignupDialog();
        await this.checkSignupOptions(dialog, meal2.options);
        dialog.findElement(S.dialog.cancel).click();
        return this.driver.wait(until.elementIsNotPresent(S.dialog.signup));
    });

    after(async function() {
        this.timeout(5000);
        const dialog = await this.driver.findElements(S.dialog.dialog);
        if (dialog.length) {
            dialog[0].findElement(S.dialog.cancel).click();
            await this.driver.wait(until.elementIsNotPresent(S.dialog.dialog));
        }
    });
});

describe('delete meal', () => {
    it('should no longer display the meal after deleting it', async function() {
        this.timeout(5000);
        const dialog = await this.driver.findElements(S.dialog.dialog);
        if (dialog.length) {
            dialog[0].findElement(S.dialog.cancel).click();
            await this.driver.wait(until.elementIsNotPresent(S.dialog.dialog));
        }
        await this.driver.findElement(S.db.getMealByName(meal.name)).findElement(S.db.m.delete).click();
        await this.driver.waitElementLocated(S.dialog.submit).click();
        await this.driver.awaitBusyComplete();

        return this.driver.wait(until.elementIsNotPresent(S.db.getMealByName(meal.name)), 2000);
    });
});


describe('create meal without options', () => {
    before(function() {
        this.setupMeal = setupMeal.bind(this);
        this.testMeal = testMeal.bind(this);
        this.setOption = setOption.bind(this);
        this.addOption = addOption.bind(this);
        this.openMealDialog = openMealDialog.bind(this);
        this.openSignupDialog = openSignupDialog.bind(this);
        this.checkSignupOptions = checkSignupOptions.bind(this);
    });

    it('should create a meal using the provided options', async function() {
        this.timeout(20000);

        await this.openMealDialog();
        await this.setupMeal(meal3);

        await this.driver.awaitBusyComplete();
        await this.driver.wait(until.elementCountIs(1, S.db.meal), 5000);
        const dialog = await this.driver.findElements(S.dialog.meal),
            mealElems = await this.driver.findElements(S.db.meal);

        expect(dialog.length).to.equal(0);
        expect(mealElems.length).to.equal(1);

        await this.testMeal(mealElems[0], meal3);
    });

    it('should display no meal options on signup', async function() {
        this.timeout(5000);
        const dialog = await this.openSignupDialog();
        expect(await dialog.findElements(S.su.option)).to.have.lengthOf(0);
        dialog.findElement(S.dialog.cancel).click();
        await this.driver.wait(until.elementIsNotPresent(S.dialog.signup));
    });

    after(async function() {
        this.timeout(5000);
        const dialog = await this.driver.findElements(S.dialog.dialog);
        if (dialog.length) {
            dialog[0].findElement(S.dialog.cancel).click();
            await this.driver.wait(until.elementIsNotPresent(S.dialog.dialog));
        }
        await this.driver.findElement(S.db.getMealByName(meal3.name)).findElement(S.db.m.delete).click();
        await this.driver.waitElementLocated(S.dialog.submit).click();
        await this.driver.awaitBusyComplete();

        return this.driver.wait(until.elementIsNotPresent(S.db.getMealByName(meal3.name)), 2000);
    });
});