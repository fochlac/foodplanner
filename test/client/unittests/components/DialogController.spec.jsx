import { mount, shallow } from 'enzyme'

import ConfirmationDialog from 'UI/ConfirmationDialog.js'
import CreateMealDialog from 'UI/CreateMealDialog.js'
import DialogController from 'ROOT/DialogController.jsx'
import ImpressumDialog from 'UI/ImpressumDialog.js'
import IncomingPaymentsDialog from 'UI/IncomingPaymentsDialog.js'
import LoginDialog from 'UI/LoginDialog.js'
import PriceDialog from 'UI/PriceDialog.js'
import PrintDialog from 'UI/PrintDialog.js'
import React from 'react'
import SendMoneyDialog from 'UI/SendMoneyDialog.js'
import SettingsDialog from 'UI/SettingsDialog.js'
import SignUpDialog from 'UI/SignUpDialog.js'
import TransactionDialog from 'UI/TransactionDialog.js'

describe('DialogController', () => {
  test('should render correct dialog', () => {
    const wrapper = shallow(<DialogController dialog={{}} />)
    expect(wrapper.type()).toBe(null)

    wrapper.setProps({ dialog: { type: 'MEAL_EDIT', option: {} } })
    expect(wrapper.find(SignUpDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'MEAL_SIGNUP', option: {} } })
    expect(wrapper.find(SignUpDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'CREATE_MEAL', option: {} } })
    expect(wrapper.find(CreateMealDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'EDIT_MEAL', option: {} } })
    expect(wrapper.find(CreateMealDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'SEND_MONEY', option: {} } })
    expect(wrapper.find(SendMoneyDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'EDIT_PRICE', option: {} } })
    expect(wrapper.find(PriceDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'SUBSCRIBE', option: {} } })
    expect(wrapper.find(SettingsDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'OPEN_TRANSACTIONS', option: {} } })
    expect(wrapper.find(TransactionDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'UNSUBSCRIBE', option: {}, location: { search: '?list=deadlineReminder' }, user: {} } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'UNSUBSCRIBE', option: {}, location: { search: '?' }, user: {} } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'OPEN_SETTINGS', option: {} } })
    expect(wrapper.find(SettingsDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'OPEN_IMPRESSUM', option: {} } })
    expect(wrapper.find(ImpressumDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'CANCEL_MEAL', option: {} } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'PRINT_MEAL', option: {} } })
    expect(wrapper.find(PrintDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'INCOMING_PAYMENTS', option: {} } })
    expect(wrapper.find(IncomingPaymentsDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'LOGIN', option: {} } })
    expect(wrapper.find(LoginDialog)).toHaveLength(1)
  })
})
