import React from 'react';
import { expect } from 'chai';
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


describe('DialogController', () => {
  it('should render correct dialog', () => {
    const wrapper = shallow(<DialogController dialog={{}} />);
    expect(wrapper.type(), 'no dialog').to.equal(null);

    wrapper.setProps({dialog: {type: 'MEAL_EDIT', option: {}}});
    expect(wrapper.find(SignUpDialog), 'MEAL_EDIT').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'MEAL_SIGNUP', option: {}}});
    expect(wrapper.find(SignUpDialog), 'MEAL_SIGNUP').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'CREATE_MEAL', option: {}}});
    expect(wrapper.find(CreateMealDialog), 'CREATE_MEAL').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'EDIT_MEAL', option: {}}});
    expect(wrapper.find(CreateMealDialog), 'EDIT_MEAL').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'SEND_MONEY', option: {}}});
    expect(wrapper.find(SendMoneyDialog), 'SEND_MONEY').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'EDIT_PRICE', option: {}}});
    expect(wrapper.find(PriceDialog), 'EDIT_PRICE').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'SUBSCRIBE', option: {}}});
    expect(wrapper.find(SettingsDialog), 'SUBSCRIBE').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'OPEN_TRANSACTIONS', option: {}}});
    expect(wrapper.find(TransactionDialog), 'OPEN_TRANSACTIONS').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'UNSUBSCRIBE', option: {}, location: {search: '?list=deadlineReminder'}, user: {} }});
    expect(wrapper.find(ConfirmationDialog), 'UNSUBSCRIBE').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'OPEN_SETTINGS', option: {}}});
    expect(wrapper.find(SettingsDialog), 'OPEN_SETTINGS').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'OPEN_IMPRESSUM', option: {}}});
    expect(wrapper.find(ImpressumDialog), 'OPEN_IMPRESSUM').to.have.lengthOf(1);

    wrapper.setProps({dialog: {type: 'CANCEL_MEAL', option: {}}});
    expect(wrapper.find(ConfirmationDialog), 'CANCEL_MEAL').to.have.lengthOf(1);
  });
});