import React from 'react';
import { shallow, mount } from 'enzyme';

import { formatDate } from 'SCRIPTS/date.js';
import TransactionDialog from 'UI/TransactionDialog/TransactionDialog.jsx';
import Pager from 'UI/Pager/Pager.jsx';

describe('TransactionDialog', () => {
  test('should render all elements', () => {
    let get_transaction_history = false;
    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} close_dialog={() => dialog_closed=true} get_transaction_history={() => get_transaction_history=true}/>);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
    expect(wrapper.find('.foot .cancel').length).toBe(1);

    expect(wrapper.find('.body p')).toHaveLength(1);
    expect(wrapper.find('.body').find(Pager)).toHaveLength(0);
  });

  test('should show transactions', () => {
    let get_transaction_history = false;
    const TEST_TRANSACTION = {
        time: Date.now() - 2000000,
        reason: 'test1',
        user: 'testusername',
        diff: 5
      },
      wrapper = shallow(<TransactionDialog transactions={[TEST_TRANSACTION]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>),
      row = wrapper.find('.body').find(Pager).find('tr > td');

    expect(wrapper.find('.body').find(Pager)).toHaveLength(1);
    expect(row).toHaveLength(5);
    expect(row.at(0).text()).toContain(formatDate(TEST_TRANSACTION.time));
    expect(row.at(1).text()).toContain(TEST_TRANSACTION.reason);
    expect(row.at(2).text()).toContain(TEST_TRANSACTION.user);
    expect(row.at(3).text()).toContain(TEST_TRANSACTION.diff.toFixed(2));
    expect(row.at(3).prop('className')).not.toContain('negative');
    expect(row.at(4).prop('className')).not.toContain('negative');
  });

  test('should show negative transactions', () => {
    let get_transaction_history = false;
    const TEST_TRANSACTION = {
        time: Date.now() - 2000000,
        reason: 'test1',
        user: 'testusername',
        diff: -5
      },
      wrapper = shallow(<TransactionDialog transactions={[TEST_TRANSACTION]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>),
      row = wrapper.find('.body').find(Pager).find('tr > td');

    expect(wrapper.find('.body').find(Pager)).toHaveLength(1);
    expect(row).toHaveLength(5);
    expect(row.at(0).text()).toContain(formatDate(TEST_TRANSACTION.time));
    expect(row.at(1).text()).toContain(TEST_TRANSACTION.reason);
    expect(row.at(2).text()).toContain(TEST_TRANSACTION.user);
    expect(row.at(3).text()).toContain(TEST_TRANSACTION.diff.toFixed(2));
    expect(row.at(3).prop('className')).toContain('negative');
    expect(row.at(4).prop('className')).toContain('negative');
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should call get_transaction_history on mount', () => {
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{id: 10}} get_transaction_history={(data) => get_transaction_history=data} close_dialog={() => dialog_closed=true}/>);

    expect(get_transaction_history).toBe(10);
  });
});