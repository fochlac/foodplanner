import { mount, shallow } from 'enzyme'

import React from 'react'
import sinon from 'sinon'
import GeneralAdministration from 'PAGES/AdministrationPage/GeneralAdministration.jsx'
import InputRow from 'RAW/InputRow.jsx'

const instance = {
  id: 2,
  icon: 'fa-star',
  title: 'testname',
  gmail_user: 'test123@gmail.com',
  gmail_pass: 'pass123',
  gmail_state: true,
}

const generalActions = { validateGmail: sinon.spy(), saveGmail: sinon.spy(), saveInstanceData: sinon.spy() }

describe('TransactionAdministration', () => {
  test('should correctly render data', () => {
    const wrapper = shallow(<GeneralAdministration instance={instance} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />)

    expect(generalActions.validateGmail.calledOnce).toBeTruthy()

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onBlur')('change1', true)

    expect(generalActions.saveInstanceData.lastCall.calledWith(2, { title: 'change1' })).toBeTruthy()

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onBlur')('change2', false)
    expect(generalActions.saveInstanceData.lastCall.calledWith(2, { title: 'change1' })).toBeTruthy()

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onBlur')('change2', true)
    expect(generalActions.saveInstanceData.lastCall.calledWith(2, { icon: 'change2' })).toBeTruthy()

    expect(wrapper.find('.gmail .fa-check-circle-o')).toHaveLength(1)
    generalActions.validateGmail.resetHistory()
  })

  test('should render connection error', () => {
    const wrapper = shallow(
      <GeneralAdministration instance={{ ...instance, gmail_state: false }} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />,
    )

    expect(generalActions.validateGmail.calledOnce).toBeTruthy()

    expect(wrapper.find('.gmail .fa-times-circle-o')).toHaveLength(1)
    generalActions.validateGmail.resetHistory()
  })

  test('should not validate user without user data', () => {
    const wrapper = shallow(
      <GeneralAdministration instance={{ ...instance, gmail_state: false, gmail_user: 'asd' }} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />,
    )

    expect(generalActions.validateGmail.notCalled).toBeTruthy()

    expect(wrapper.find('.gmail .fa-times-circle-o')).toHaveLength(1)
    generalActions.validateGmail.resetHistory()
  })

  test('should display no connection error', () => {
    const wrapper = shallow(
      <GeneralAdministration instance={{ ...instance, gmail_state: false, gmail_user: '' }} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />,
    )

    expect(wrapper.find('.noConnection')).toHaveLength(1)
    wrapper.find('.noConnection .fakeLink').simulate('click')
    wrapper.update()

    expect(wrapper.find('.gmail').find(InputRow)).toHaveLength(2)
    generalActions.validateGmail.resetHistory()
  })

  test('should reset data on cancel edit gmail data', () => {
    const wrapper = shallow(<GeneralAdministration instance={instance} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />)

    expect(wrapper.find('.fa-pencil')).toHaveLength(1)
    wrapper.find('.fa-pencil').simulate('click')
    wrapper.update()

    expect(wrapper.find('.gmail').find(InputRow)).toHaveLength(2)

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(0)
      .prop('onChange')('test1')

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(1)
      .prop('onChange')('test2')

    wrapper.update()

    wrapper
      .find('.gmail')
      .find('button')
      .at(0)
      .simulate('click')

    wrapper.update()

    expect(wrapper.state()).toMatchObject({ gmail_user: 'test123@gmail.com', gmail_pass: 'pass123' })
  })

  test('should reset data on cancel edit gmail data', () => {
    const wrapper = shallow(<GeneralAdministration instance={{}} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />)

    expect(wrapper.find('.noConnection .fakeLink')).toHaveLength(1)
    wrapper.find('.noConnection .fakeLink').simulate('click')
    wrapper.update()

    expect(wrapper.find('.gmail').find(InputRow)).toHaveLength(2)

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(0)
      .prop('onChange')('test1')

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(1)
      .prop('onChange')('test2')

    wrapper.update()

    wrapper
      .find('.gmail')
      .find('button')
      .at(0)
      .simulate('click')

    wrapper.update()

    expect(wrapper.state()).toMatchObject({ gmail_user: '', gmail_pass: '' })
  })

  test('should handle update', () => {
    const wrapper = shallow(<GeneralAdministration instance={instance} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />)

    wrapper.setProps({ instance: { ...instance, gmail_state: undefined } })
    wrapper.update()

    expect(wrapper.state('gmail_state')).toBeTruthy()
    wrapper.setProps({ instance: { ...instance, gmail_state: false } })
    wrapper.update()

    expect(wrapper.state('gmail_state')).toBeFalsy()

    wrapper.find('.fa-pencil').simulate('click')
    wrapper.update()
    expect(wrapper.state('gmail_edit')).toBeTruthy()

    wrapper.setProps({ instance: { ...instance, gmail_state: false } })
    wrapper.update()

    expect(wrapper.state('gmail_edit')).toBeTruthy()

    wrapper.setProps({ instance: { ...instance, gmail_state: true } })
    wrapper.update()

    expect(wrapper.state('gmail_edit')).toBeFalsy()
  })

  test('should show busy', () => {
    const wrapper = shallow(<GeneralAdministration instance={instance} app={{ hiddenBusy: true, busyList: ['gmail'] }} {...generalActions} />)

    expect(wrapper.find('.textAlignCenter.col_green')).toHaveLength(1)
  })

  test('should use default value for instance', () => {
    const wrapper = shallow(<GeneralAdministration instance={{}} app={{ hiddenBusy: false, busyList: [''] }} {...generalActions} />)

    expect(wrapper.state('gmail_user')).toEqual('')
    expect(wrapper.state('gmail_pass')).toEqual('')
  })

  test('should save data', () => {
    const wrapper = shallow(<GeneralAdministration instance={instance} app={{ hiddenBusy: false, busyList: [] }} {...generalActions} />)

    expect(wrapper.find('.fa-pencil')).toHaveLength(1)
    wrapper.find('.fa-pencil').simulate('click')
    wrapper.update()

    expect(wrapper.find('.gmail').find(InputRow)).toHaveLength(2)

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(0)
      .prop('onChange')('test1@gm')

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(1)
      .prop('onChange')('')

    wrapper.update()

    wrapper
      .find('.gmail')
      .find('button')
      .at(1)
      .simulate('click')

    wrapper.update()

    expect(generalActions.saveGmail.calledOnce).toBeFalsy()

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(0)
      .prop('onChange')('test1@gmail.com')

    wrapper
      .find('.gmail')
      .find(InputRow)
      .at(1)
      .prop('onChange')('test2')

    wrapper.update()

    wrapper
      .find('.gmail')
      .find('button')
      .at(1)
      .simulate('click')

    wrapper.update()

    expect(generalActions.saveGmail.calledOnce).toBeTruthy()
    expect(generalActions.saveGmail.lastCall.args).toEqual([2, { gmail_user: 'test1@gmail.com', gmail_pass: 'test2' }])
  })
})
