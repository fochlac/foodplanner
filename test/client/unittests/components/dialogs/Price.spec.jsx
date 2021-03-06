import React from 'react';
import { shallow, mount } from 'enzyme';
import Price from 'DIALOG/PriceDialog/Price.jsx';

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
  test('should render all elements', () => {
    let output = {}
    const wrapper = shallow(<Price meal={meal} price_options={opt => output = opt} />);

    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('tbody > tr').length).toBe(8);
    expect(wrapper.find('tbody > tr.base').length).toBe(1);
    expect(wrapper.find('tbody > tr.base input').length).toBe(1);
    expect(wrapper.find('tbody > tr.base span.moneySymbol').length).toBe(1);
    expect(wrapper.find('tbody > tr.value').length).toBe(4);
    expect(wrapper.find('tbody > tr.value input').length).toBe(4);
    expect(wrapper.find('tbody > tr.value span.moneySymbol').length).toBe(4);
    expect(wrapper.find('tbody > tr.header').length).toBe(2);
    expect(wrapper.find('tbody > tr.toggle').length).toBe(1);
    expect(wrapper.find('tbody > tr.toggle input').length).toBe(1);
    expect(wrapper.find('tbody > tr.toggle span.moneySymbol').length).toBe(1);

    wrapper.find('tbody > tr').forEach((row, index) => {
      let opt = optionMap[index];

      switch(opt.type) {
        case 'meal':
          expect(row.find('input').prop('defaultValue')).toBe(opt.price.toFixed(2));
          break;
        case 'toggle':
          expect(row.find('td > b').text()).toContain(opt.name);
          expect(row.find('input').prop('defaultValue')).toBe(opt.price.toFixed(2));
          break;
        case 'value':
          expect(row.find('td').filterWhere(row => !row.find('div').length).text()).toContain(opt.name);
          expect(row.find('input').prop('defaultValue')).toBe(opt.price.toFixed(2));
          break;
        default:
          expect(row.find('td > b').text()).toContain(opt.name);
      }
    });
  });
  test('properly output price object on input', () => {
    let output = {}
    const wrapper = shallow(<Price meal={meal} price_options={opt => output = opt} />);

    wrapper.find('tbody > tr.base input').simulate('change', {target: {value: 1}});
    expect(output).toEqual({
      'meals_0': {id: 0, db: 'meals', price: 1}
    });
    wrapper.find('tbody > tr.toggle input').simulate('change', {target: {value: 2}});
    expect(output).toEqual({
      'meals_0': {id: 0, db: 'meals', price: 1},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2}
    });
    wrapper.find('tbody > tr.value input').first().simulate('change', {target: {value: 3}});
    expect(output).toEqual({
      'meals_0': {id: 0, db: 'meals', price: 1},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2},
      'mealOptionValues_4': {id: 4, db: 'mealOptionValues', price: 3}
    });
    wrapper.find('tbody > tr.base input').simulate('change', {target: {value: 4}});
    expect(output).toEqual({
      'meals_0': {id: 0, db: 'meals', price: 4},
      'mealOptions_1': {id: 1, db: 'mealOptions', price: 2},
      'mealOptionValues_4': {id: 4, db: 'mealOptionValues', price: 3}
    });
  });
});