import React from 'react';
import { shallow, mount } from 'enzyme';
import EmailInput from 'UI/EmailInput.js';
import SendMoneyDialog from 'UI/SendMoneyDialog/SendMoneyDialog.jsx';

describe('SendMoneyDialog', () => {
  test('should render all elements', () => {
    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
    expect(wrapper.find('.foot button').length).toBe(2);

    expect(wrapper.find('.body input')).toHaveLength(1);
    expect(wrapper.find(EmailInput)).toHaveLength(1);
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should output correct data on submit button click', () => {
    let send_money = false;

    const TEST_USER = {id: 1},
      TEST_AMOUNT = 10,
      TEST_APP = {mailSuggestion: {id: 2}},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} app={TEST_APP} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.body input').simulate('change', {target: {value: TEST_AMOUNT}});
    wrapper.find('button.submit').simulate('click');

    expect(send_money).toEqual({
      target: TEST_APP.mailSuggestion.id,
      source: 1,
      amount: TEST_AMOUNT
    });
  });
});