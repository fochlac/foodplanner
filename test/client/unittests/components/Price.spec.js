import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Price from 'UI/PriceDialog/Price.jsx';

const meal = {
    options: [{
      id: 1,
      name: 'test5',
      type: 'toggle',
      price: 0
    }, {
      id: 2,
      name: 'test6',
      type: 'select',
      price: 0,
      values:[{name: 'test1', price: 0, id: 4}, {name: 'test2', price: 0, id: 5}]
    }, {
      id: 3,
      name: 'test7',
      type: 'count',
      price: 0,
      values:[{name: 'test3', price: 0, id: 6}, {name: 'test4', price: 0, id: 7}]
    }],
    price: 0,
    name: 'test8',
    id: 0
  },
  optionMap = [
    {...meal, type: 'meal'},
    meal.options[0],
    meal.options[1],
    {...meal.options[1].values[0], type: 'value'},
    {...meal.options[1].values[1], type: 'value'},
    meal.options[2],
    {...meal.options[2].values[0], type: 'value'},
    {...meal.options[2].values[1], type: 'value'}
  ];

describe('PriceDialog', () => {
  it('should render all elements', () => {
    let output = {}
    const wrapper = shallow(<Price meal={meal} price_options={opt => output = opt} />);

    expect(wrapper.find('.body').length).to.equal(1, 'body missing');
    expect(wrapper.find('tbody > tr').length).to.equal(8, 'rows missing');
    expect(wrapper.find('tbody > tr.base').length).to.equal(1, 'base row missing');
    expect(wrapper.find('tbody > tr.base input').length).to.equal(1, 'base rows input missing');
    expect(wrapper.find('tbody > tr.base span.moneySymbol').length).to.equal(1, 'base rows money symbol missing');
    expect(wrapper.find('tbody > tr.value').length).to.equal(4, 'value rows missing');
    expect(wrapper.find('tbody > tr.value input').length).to.equal(4, 'value rows input missing');
    expect(wrapper.find('tbody > tr.value span.moneySymbol').length).to.equal(4, 'value rows money symbol missing');
    expect(wrapper.find('tbody > tr.header').length).to.equal(2, 'header rows missing');
    expect(wrapper.find('tbody > tr.toggle').length).to.equal(1, 'toggle row missing');
    expect(wrapper.find('tbody > tr.toggle input').length).to.equal(1, 'toggle rows input missing');
    expect(wrapper.find('tbody > tr.toggle span.moneySymbol').length).to.equal(1, 'toggle rows money symbol missing');

    wrapper.find('tbody > tr').forEach((row, index) => {
      let opt = optionMap[index];

      switch(opt.type) {
        case 'meal':
          expect(row.find('input').prop('defaultValue')).to.equal(opt.price.toFixed(2));
          break;
        case 'toggle':
          expect(row.find('td > b').text()).to.include(opt.name);
          expect(row.find('input').prop('defaultValue')).to.equal(opt.price.toFixed(2));
          break;
        case 'value':
          expect(row.find('td').filterWhere(row => !row.find('div').length).text()).to.include(opt.name);
          expect(row.find('input').prop('defaultValue')).to.equal(opt.price.toFixed(2));
          break;
        default:
          expect(row.find('td > b').text()).to.include(opt.name);
      }
    });
  });
  it('properly output price object on input', () => {
    let output = {}
    const wrapper = shallow(<Price meal={meal} price_options={opt => output = opt} />);

    wrapper.find('tbody > tr.base input').simulate('change', {target: {value: 1}});
    expect(output).to.deep.equal({
      'meals_0': {id: 0, db: 'meals', price: 1}
    });
    wrapper.find('tbody > tr.toggle input').simulate('change', {target: {value: 2}});
    expect(output).to.deep.equal({
      'meals_0': {id: 0, db: 'meals', price: 1},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2}
    });
    wrapper.find('tbody > tr.value input').first().simulate('change', {target: {value: 3}});
    expect(output).to.deep.equal({
      'meals_0': {id: 0, db: 'meals', price: 1},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2},
      'mealOptionValues_4': {id: 4, db: 'mealOptionValues', price: 3}
    });
    wrapper.find('tbody > tr.base input').simulate('change', {target: {value: 4}});
    expect(output).to.deep.equal({
      'meals_0': {id: 0, db: 'meals', price: 4},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2},
      'mealOptionValues_4': {id: 4, db: 'mealOptionValues', price: 3}
    });

  });
});