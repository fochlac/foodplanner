import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Meal from 'UI/Meal/Meal.jsx';

function mergeById(arr1, arr2) {
  return arr1.map(option => Object.assign({}, option, arr2.find(opt => opt.id === option.id)));
}

function validateOptions(wrapper, mgOpt) {
  let diff = 0;

  mgOpt.forEach((opt, index) => {
    if (opt.type !== 'toggle' || opt.show) {
      let elem = wrapper.find('.signupOptions > li').at(index - diff);

      switch (opt.type) {
        case 'count':
          expect(elem.find('.optionCount'), `option ${opt.name} has no count elem`).to.have.lengthOf(1);
          expect(elem.find('.optionCount').text(), `option ${opt.name} text does not include correct count`).to.include(opt.count);
        case 'select':
          expect(elem.find('.optionValue'), `option ${opt.name} has no select elem`).to.have.lengthOf(1);
          expect(elem.find('.optionValue').text(), `option ${opt.name} text does not include correct value`).to.include(opt.value);
          break;
        case 'toggle':
          expect(elem.find('.optionShow'), `option ${opt.name} has no name elem`).to.have.lengthOf(1);
          expect(elem.find('.optionShow').text(), `option ${opt.name} text does not include correct option name`).to.include(opt.name);
          break;
      }
    } else {
      diff++;
    }
  })
}
let output;

const actions = {
  start_edit_meal: () => output = arguments,
  start_meal_signup: () => output = arguments,
  start_cancel_meal: () => output = arguments,
  start_edit_price: () => output = arguments,
  start_meal_edit: () => output = arguments,
  meal_cancel: () => output = arguments,
}

const TU1 = {
    name: 'testuser',
    id: 0
  },
  TU2 = {
    name: 'testuser2',
    id: 1
  },
  TM = ({locked = 0, options = [], time = (Date.now() + 20000000), deadline = (Date.now() + 10000000), signups = [], signupLimit = 3, image}) => ({
    id: 1,
    name: 'testmeal',
    creator: TU1.name,
    creatorId: TU1.id,
    image,
    description: 'testdescription',
    signupLimit,
    signups,
    deadline,
    time,
    options,
    locked
  }),
  TO = [{
    "id": 1,
    "name": "Hackfleisch",
    "type": "select",
    "price": 0,
    "values": [{
        "name": "Rind",
        "price": 5,
        "id": 1
    }, {
        "name": "Schwein",
        "price": 3,
        "id": 2
    }]
  }, {
    "id": 2,
    "name": "Brötchen",
    "type": "count",
    "price": 0,
    "values": [{
      "name": "Doppel",
      "price": 0,
      "id": 3
    }, {
      "name": "Kürbiskern",
      "price": 0,
      "id": 4
    }]
  }, {
    "id": 3,
    "name": "Zwiebel",
    "type": "toggle",
    "price": 0,
    "values": []
  }],
  TS = ({id = 1, name="testanon", comment="testcomment", meal = 1, paid = 0, price = null, userId, options = []}) => ({
    id,
    name,
    comment,
    meal,
    paid,
    price,
    userId,
    options
  }),
  TSO = ({id = 1, value = null, count = null, show = null}) => ({
    id,
    value,
    count,
    show
  });


describe('Meal', () => {
  it('should render all elements', () => {
    const user = TU1,
      signups = {
        1: TS({id: 1, price: 3, options: [TSO({id: 1, value: 'Schwein'}), TSO({id: 2, value: 'Kürbiskern', count: 2}), TSO({id: 3, show: 1})]}),
        2: TS({id: 2, price: 3, options: [TSO({id: 1, value: 'Rind'}), TSO({id: 2, value: 'Kürbiskern', count: 2}), TSO({id: 3, show: 0})]})
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO});

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
          signupElems = wrapper.find('.participantsList > li');

    expect(wrapper.find('.meal'), 'meal frame not found').to.have.lengthOf(1);
    expect(wrapper.find('.titlebar'), 'meal titlebar not found').to.have.lengthOf(1);
    expect(wrapper.find('.titlebar .name'), 'meal titlebar name not found').to.have.lengthOf(1);
    expect(wrapper.find('.titlebar .menuIcon'), 'meal titlebar actions not found').to.have.lengthOf(3);
    expect(wrapper.find('.details'), 'meal details not found').to.have.lengthOf(1);
    expect(wrapper.find('.mealImage'), 'meal image not found').to.have.lengthOf(1);
    expect(wrapper.find('.date'), 'meal date not found').to.have.lengthOf(1);
    expect(wrapper.find('.creator'), 'meal creator not found').to.have.lengthOf(1);
    expect(wrapper.find('.description'), 'meal description not found').to.have.lengthOf(1);
    expect(wrapper.find('.participants'), 'meal participants not found').to.have.lengthOf(1);
    expect(wrapper.find('.participation'), 'meal participation area not found').to.have.lengthOf(1);
    expect(wrapper.find('.count'), 'meal participation count not found').to.have.lengthOf(1);
    expect(wrapper.find('.limit'), 'meal participation limit not found').to.have.lengthOf(1);
    expect(wrapper.find('.deadline'), 'meal deadline not found').to.have.lengthOf(1);
    expect(wrapper.find('.participate'), 'meal participate link not found').to.have.lengthOf(1);
    expect(wrapper.find('.participantsList'), 'meal participantsList not found').to.have.lengthOf(1);

    expect(signupElems, 'meal signups not found').to.have.lengthOf(2);

    signupElems.forEach((signup, index) => {
      expect(signup.find('.user .name'), 'signup user name not found').to.have.lengthOf(1);
      expect(signup.find('.money'), 'signup price not found').to.have.lengthOf(1);
      expect(signup.find('.icons'), 'signup edit options not found').to.have.lengthOf(1);
      expect(signup.find('.icons > span'), 'signup edit actions not found').to.have.lengthOf(2);
      expect(signup.find('.comment'), 'signup comment not found').to.have.lengthOf(1);

      expect(signup.find('.signupOptions'), 'signup options not found').to.have.lengthOf(1);
      expect(signup.find('.signupOptions > li'), 'signup options wrong count').to.have.lengthOf(signups[signupArray[index]].options[2].show ? 3 : 2);
      validateOptions(signup, mergeById(signups[signupArray[index]].options, meal.options));
    });
  });
});