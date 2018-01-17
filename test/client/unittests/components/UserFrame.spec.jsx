import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import UserFrame from 'UI/UserFrame/UserFrame.jsx';
import EmailInput from 'UI/EmailInput.js';

let output;

const user = {
		id: 1,
		name: 'test',
		admin: true,
		balance: 10,

	},
	actions = {
		sign_in: (data) => output = {data, type: 'sign_in'},
		save_settings: (data) => output = {data, type: 'save_settings'},
		show_transaction_history: () => output = 'show_transaction_history',
		start_send_money: () => output = 'start_send_money'
	}

describe('UserFrame', () => {
  it('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user} app={{}} {...actions} />);

    expect(wrapper.find('.userFrame')).to.have.lengthOf(1);
    expect(wrapper.find('.userDescription')).to.have.lengthOf(1);
    expect(wrapper.find('.userName')).to.have.lengthOf(1);
    expect(wrapper.find('.userName').text()).to.include(user.name);
    expect(wrapper.find('.balance')).to.have.lengthOf(1);
    expect(wrapper.find('.balance').text()).to.include(user.balance.toFixed(2));
    expect(wrapper.find('.role')).to.have.lengthOf(1);
    expect(wrapper.find('.historyLink')).to.have.lengthOf(1);
    expect(wrapper.find('.userManagementLink')).to.have.lengthOf(1);
  });

  it('should render a unregistered frame and switch between register / signin', () => {
    const wrapper = shallow(<UserFrame user={{}} app={{}} {...actions} />);

    expect(wrapper.find('.userFrame.register')).to.have.lengthOf(1);
    expect(wrapper.find('.registerLink')).to.have.lengthOf(1);
    expect(wrapper.find(EmailInput)).to.have.lengthOf(1);
    expect(wrapper.find('.userFrame.register button')).to.have.lengthOf(1);

    wrapper.find('.registerLink').simulate('click');
    expect(wrapper.find('.signinLink')).to.have.lengthOf(1);
    expect(wrapper.find('.userFrame .name')).to.have.lengthOf(1);
    expect(wrapper.find('.userFrame .mail')).to.have.lengthOf(1);
    expect(wrapper.find('.userFrame.register button')).to.have.lengthOf(1);

    wrapper.find('.signinLink').simulate('click');

    expect(wrapper.find('.registerLink')).to.have.lengthOf(1);
    expect(wrapper.find(EmailInput)).to.have.lengthOf(1);
    expect(wrapper.find('.userFrame.register button')).to.have.lengthOf(1);
  });

  it('should output correct data on login / register', () => {
    const TESTNAME = 'test123',
    	TESTMAIL = 'test@test.de',
    	wrapper = shallow(<UserFrame user={{}} app={{mailSuggestion: 'test123'}} {...actions} />);

    wrapper.find('.userFrame.register button').simulate('click');

    expect(output.data).to.equal('test123');
    expect(output.type).to.equal('sign_in');

    wrapper.find('.registerLink').simulate('click');
    wrapper.find('.userFrame .name').simulate('change', {target: {value: TESTNAME}})
    wrapper.find('.userFrame .mail').simulate('change', {target: {value: TESTMAIL}})
    wrapper.find('.userFrame.register button').simulate('click');

    expect(output.type).to.equal('save_settings');
    expect(output.data).to.deep.equal({
    	creationNotice_mail: 0,
    	deadlineReminder_mail: 0,
		name: TESTNAME,
		mail: TESTMAIL
    });
  });

  it('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user} app={{}} {...actions} />);

    wrapper.find('.historyLink').simulate('click');
    expect(output).to.equal('show_transaction_history');

    wrapper.find('.userManagementLink').simulate('click');
    expect(output).to.equal('start_send_money');

  });

});