import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import EmailInput from 'UI/EmailInput.js';
import SendMoneyDialog from 'UI/SendMoneyDialog/SendMoneyDialog.jsx';

describe('SendMoneyDialog', () => {
  it('should render all elements', () => {
    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1);
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1);
    expect(wrapper.find('.body').length).to.equal(1);
    expect(wrapper.find('.foot').length).to.equal(1);
    expect(wrapper.find('.foot button').length).to.equal(2);

    expect(wrapper.find('.body input')).to.have.lengthOf(1);
    expect(wrapper.find(EmailInput), 'email input not found').to.have.lengthOf(1);
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should output correct data on submit button click', () => {
    let send_money = false;

    const TEST_USER = {id: 1},
      TEST_AMOUNT = 10,
      TEST_APP = {mailSuggestion: {id: 2}},
      wrapper = shallow(<SendMoneyDialog user={TEST_USER} app={TEST_APP} send_money={(output) => send_money=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.body input').simulate('change', {target: {value: TEST_AMOUNT}});
    wrapper.find('button.submit').simulate('click');

    expect(send_money).to.deep.equal({
      target: TEST_APP.mailSuggestion.id,
      source: 1,
      amount: TEST_AMOUNT
    });
  });
});