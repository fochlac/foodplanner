import React from 'react';
import { shallow, mount } from 'enzyme';
import DialogController from 'ROOT/DialogController.jsx';

import SignUpDialog from 'UI/SignUpDialog.js';
import CreateMealDialog from 'UI/CreateMealDialog.js';
import ConfirmationDialog from 'UI/ConfirmationDialog.js';
import SettingsDialog from 'UI/SettingsDialog.js';
import PriceDialog from 'UI/PriceDialog.js';
import TransactionDialog from 'UI/TransactionDialog.js';
import ImpressumDialog from 'UI/ImpressumDialog.js';
import SendMoneyDialog from 'UI/SendMoneyDialog.js';
import PrintDialog from 'UI/PrintDialog.js';


describe('DialogController', () => {
  test('should render correct dialog', () => {
    const wrapper = shallow(<DialogController dialog={{}} />);
    expect(wrapper.type()).toBe(null);

    wrapper.setProps({dialog: {type: 'MEAL_EDIT', option: {}}});
    expect(wrapper.find(SignUpDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'MEAL_SIGNUP', option: {}}});
    expect(wrapper.find(SignUpDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'CREATE_MEAL', option: {}}});
    expect(wrapper.find(CreateMealDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'EDIT_MEAL', option: {}}});
    expect(wrapper.find(CreateMealDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'SEND_MONEY', option: {}}});
    expect(wrapper.find(SendMoneyDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'EDIT_PRICE', option: {}}});
    expect(wrapper.find(PriceDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'SUBSCRIBE', option: {}}});
    expect(wrapper.find(SettingsDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'OPEN_TRANSACTIONS', option: {}}});
    expect(wrapper.find(TransactionDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'UNSUBSCRIBE', option: {}, location: {search: '?list=deadlineReminder'}, user: {} }});
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'OPEN_SETTINGS', option: {}}});
    expect(wrapper.find(SettingsDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'OPEN_IMPRESSUM', option: {}}});
    expect(wrapper.find(ImpressumDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'CANCEL_MEAL', option: {}}});
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1);

    wrapper.setProps({dialog: {type: 'PRINT_MEAL', option: {}}});
    expect(wrapper.find(PrintDialog)).toHaveLength(1);
  });
});