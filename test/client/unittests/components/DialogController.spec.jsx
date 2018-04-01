import { mount, shallow } from 'enzyme'

import AddDateDialog from 'DIALOG/AddDateDialog.js'
import ConfirmationDialog from 'DIALOG/ConfirmationDialog.js'
import CreateMealDialog from 'DIALOG/CreateMealDialog.js'
import DialogController from 'CONNECTED/DefaultPage/DialogController.jsx'
import ImpressumDialog from 'DIALOG/ImpressumDialog.js'
import IncomingPaymentsDialog from 'DIALOG/IncomingPaymentsDialog.js'
import LoginDialog from 'DIALOG/LoginDialog.js'
import PriceDialog from 'DIALOG/PriceDialog.js'
import PrintDialog from 'DIALOG/PrintDialog.js'
import React from 'react'
import SendMoneyDialog from 'DIALOG/SendMoneyDialog.js'
import SettingsDialog from 'DIALOG/SettingsDialog.js'
import SignUpDialog from 'DIALOG/SignUpDialog.js'
import TransactionDialog from 'DIALOG/TransactionDialog.js'

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

    wrapper.setProps({ dialog: { type: 'UNSUBSCRIBE', option: {}, content: 'deadlineReminder' } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)
    expect(wrapper.find(ConfirmationDialog).prop('message')).toContain('Anmeldefrist')

    wrapper.setProps({ dialog: { type: 'UNSUBSCRIBE', option: {}, content: 'createMeal' } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)
    expect(wrapper.find(ConfirmationDialog).prop('message')).toContain('neuem Angebot')

    wrapper.setProps({ dialog: { type: 'UNSUBSCRIBE', option: {}, content: 'all' } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'OPEN_SETTINGS', option: {} } })
    expect(wrapper.find(SettingsDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'OPEN_IMPRESSUM', option: {} } })
    expect(wrapper.find(ImpressumDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'CANCEL_MEAL', option: {} } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'DATEFINDER_DELETE_DATE', option: {} } })
    expect(wrapper.find(ConfirmationDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'PRINT_MEAL', option: {} } })
    expect(wrapper.find(PrintDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'INCOMING_PAYMENTS', option: {} } })
    expect(wrapper.find(IncomingPaymentsDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'LOGIN', option: {} } })
    expect(wrapper.find(LoginDialog)).toHaveLength(1)

    wrapper.setProps({ dialog: { type: 'DATEFINDER_ADD_DATE', option: {} } })
    expect(wrapper.find(AddDateDialog)).toHaveLength(1)
  })
})
