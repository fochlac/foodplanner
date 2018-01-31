import React from 'react';
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
  user2 = {
		id: 1,
		name: 'test',
		admin: false,
		balance: undefined,

	},
	actions = {
		sign_in: (data) => output = {data, type: 'sign_in'},
		save_settings: (data) => output = {data, type: 'save_settings'},
		show_transaction_history: () => output = 'show_transaction_history',
		start_send_money: () => output = 'start_send_money'
	}

describe('UserFrame', () => {
  test('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user} app={{}} {...actions} />);

    expect(wrapper.find('.userFrame')).toHaveLength(1);
    expect(wrapper.find('.userDescription')).toHaveLength(1);
    expect(wrapper.find('.userName')).toHaveLength(1);
    expect(wrapper.find('.userName').text()).toContain(user.name);
    expect(wrapper.find('.balance')).toHaveLength(1);
    expect(wrapper.find('.balance').text()).toContain(user.balance.toFixed(2));
    expect(wrapper.find('.role')).toHaveLength(1);
    expect(wrapper.find('.historyLink')).toHaveLength(1);
    expect(wrapper.find('.userManagementLink')).toHaveLength(1);
  });

  test('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user2} app={{}} {...actions} />);

    expect(wrapper.find('.userFrame')).toHaveLength(1);
    expect(wrapper.find('.userDescription')).toHaveLength(1);
    expect(wrapper.find('.userName')).toHaveLength(1);
    expect(wrapper.find('.userName').text()).toContain(user.name);
    expect(wrapper.find('.balance')).toHaveLength(1);
    expect(wrapper.find('.balance').text()).toContain('0€');
    expect(wrapper.find('.role')).toHaveLength(0);
    expect(wrapper.find('.historyLink')).toHaveLength(1);
    expect(wrapper.find('.userManagementLink')).toHaveLength(1);
  });

  test(
    'should render a unregistered frame and switch between register / signin',
    () => {
      const wrapper = shallow(<UserFrame user={{}} app={{}} {...actions} />);

      expect(wrapper.find('.userFrame.register')).toHaveLength(1);
      expect(wrapper.find('.registerLink')).toHaveLength(1);
      expect(wrapper.find(EmailInput)).toHaveLength(1);
      expect(wrapper.find('.userFrame.register button')).toHaveLength(1);

      wrapper.find('.registerLink').simulate('click');
      expect(wrapper.find('.signinLink')).toHaveLength(1);
      expect(wrapper.find('.userFrame .name')).toHaveLength(1);
      expect(wrapper.find('.userFrame .mail')).toHaveLength(1);
      expect(wrapper.find('.userFrame.register button')).toHaveLength(1);

      wrapper.find('.signinLink').simulate('click');

      expect(wrapper.find('.registerLink')).toHaveLength(1);
      expect(wrapper.find(EmailInput)).toHaveLength(1);
      expect(wrapper.find('.userFrame.register button')).toHaveLength(1);
    }
  );

  test('should output correct data on login / register', () => {
    const TESTNAME = 'test123',
    	TESTMAIL = 'test@test.de',
    	wrapper = shallow(<UserFrame user={{}} app={{mailSuggestion: 'test123'}} {...actions} />);

    wrapper.find('.userFrame.register button').simulate('click');

    expect(output.data).toBe('test123');
    expect(output.type).toBe('sign_in');

    wrapper.find('.registerLink').simulate('click');
    wrapper.find('.userFrame .name').simulate('change', {target: {value: TESTNAME}})
    wrapper.find('.userFrame .mail').simulate('change', {target: {value: TESTMAIL}})
    wrapper.find('.userFrame.register button').simulate('click');

    expect(output.type).toBe('save_settings');
    expect(output.data).toEqual({
    	creationNotice_mail: 0,
    	deadlineReminder_mail: 0,
		name: TESTNAME,
		mail: TESTMAIL
    });
  });

  test('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user} app={{}} {...actions} />);

    wrapper.find('.historyLink').simulate('click');
    expect(output).toBe('show_transaction_history');

    wrapper.find('.userManagementLink').simulate('click');
    expect(output).toBe('start_send_money');

  });

});