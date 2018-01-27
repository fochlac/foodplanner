import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { formatDate } from 'SCRIPTS/date.js';
import TransactionDialog from 'UI/TransactionDialog/TransactionDialog.jsx';
import Pager from 'UI/Pager/Pager.jsx';

describe('TransactionDialog', () => {
  it('should render all elements', () => {
    let get_transaction_history = false;
    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} close_dialog={() => dialog_closed=true} get_transaction_history={() => get_transaction_history=true}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1);
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1);
    expect(wrapper.find('.body').length).to.equal(1);
    expect(wrapper.find('.foot').length).to.equal(1);
    expect(wrapper.find('.foot .cancel').length).to.equal(1);

    expect(wrapper.find('.body p')).to.have.lengthOf(1);
    expect(wrapper.find('.body').find(Pager)).to.have.lengthOf(0);
  });

  it('should show transactions', () => {
    let get_transaction_history = false;
    const TEST_TRANSACTION = {
        time: Date.now() - 2000000,
        reason: 'test1',
        user: 'testusername',
        diff: 5
      },
      wrapper = shallow(<TransactionDialog transactions={[TEST_TRANSACTION]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>),
      row = wrapper.find('.body').find(Pager).find('tr > td');

    expect(wrapper.find('.body').find(Pager)).to.have.lengthOf(1);
    expect(row).to.have.lengthOf(5);
    expect(row.at(0).text()).to.include(formatDate(TEST_TRANSACTION.time));
    expect(row.at(1).text()).to.include(TEST_TRANSACTION.reason);
    expect(row.at(2).text()).to.include(TEST_TRANSACTION.user);
    expect(row.at(3).text()).to.include(TEST_TRANSACTION.diff.toFixed(2));
    expect(row.at(3).prop('className')).to.not.include('negative');
    expect(row.at(4).prop('className')).to.not.include('negative');
  });

  it('should show negative transactions', () => {
    let get_transaction_history = false;
    const TEST_TRANSACTION = {
        time: Date.now() - 2000000,
        reason: 'test1',
        user: 'testusername',
        diff: -5
      },
      wrapper = shallow(<TransactionDialog transactions={[TEST_TRANSACTION]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>),
      row = wrapper.find('.body').find(Pager).find('tr > td');

    expect(wrapper.find('.body').find(Pager)).to.have.lengthOf(1);
    expect(row).to.have.lengthOf(5);
    expect(row.at(0).text()).to.include(formatDate(TEST_TRANSACTION.time));
    expect(row.at(1).text()).to.include(TEST_TRANSACTION.reason);
    expect(row.at(2).text()).to.include(TEST_TRANSACTION.user);
    expect(row.at(3).text()).to.include(TEST_TRANSACTION.diff.toFixed(2));
    expect(row.at(3).prop('className')).to.include('negative');
    expect(row.at(4).prop('className')).to.include('negative');
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on close button click', () => {
    let dialog_closed = false;
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{}} get_transaction_history={() => get_transaction_history=true} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should call get_transaction_history on mount', () => {
    let get_transaction_history = false;

    const wrapper = shallow(<TransactionDialog transactions={[]} user={{id: 10}} get_transaction_history={(data) => get_transaction_history=data} close_dialog={() => dialog_closed=true}/>);

    expect(get_transaction_history).to.equal(10);
  });
});