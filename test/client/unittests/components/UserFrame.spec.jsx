import { mount, shallow } from 'enzyme';

import EmailInput from 'UI/EmailInput.js';
import React from 'react';
import UserFrame from 'UI/UserFrame/UserFrame.jsx';

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

  test('should render a registered frame', () => {
    const wrapper = shallow(<UserFrame user={user} app={{}} {...actions} />);

    wrapper.find('.historyLink').simulate('click');
    expect(output).toBe('show_transaction_history');

    wrapper.find('.userManagementLink').simulate('click');
    expect(output).toBe('start_send_money');

  });

});
