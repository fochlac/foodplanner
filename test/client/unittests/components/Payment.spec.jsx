import React from 'react';
import { shallow, mount } from 'enzyme';
import Payment from 'UI/PriceDialog/Payment.jsx';

describe('Payment', () => {
  test('should render all elements', () => {
    const signups = [{name: 'test1', price: 10, paid: 0}, {name: 'test2', price: 5, paid: 1}, {name: 'test3', price: 10, paid: 1}],
        wrapper = shallow(<Payment signups={signups} />);

    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.body table').length).toBe(1);
    expect(wrapper.find('.body tbody tr').length).toBe(3);
    expect(wrapper.find('.body tbody tr td.name').length).toBe(3);
    wrapper.find('.body tbody tr td.name').forEach((node, index) => expect(node.text()).toContain(signups[index].name))
    wrapper.find('.body tbody tr td.price').forEach((node, index) => expect(node.text()).toContain(signups[index].price))
    wrapper.find('.body tbody tr td.paid').forEach((node, index) => expect(node.find('.fa-check').length).toBe(signups[index].paid))
  });

  test('should set checked element invalit and vice versa', () => {
    const signups = [{id: 0, name: 'test1', price: 10, paid: 0}, {id:1, name: 'test2', price: 5, paid: 1}],
        wrapper = shallow(<Payment signups={signups} toggle_paid={(id, state) => {
          expect(state).toBe(!signups.find(signup => signup.id === id).paid);
        }} />);

    wrapper.find('.fa-check').simulate('click');
    wrapper.find('.fa-times').simulate('click');
  });
});