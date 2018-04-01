import { shallow } from 'enzyme'

import DefaultPage from 'CONNECTED/DefaultPage.js'
import GeneralAdministration from 'PAGES/AdministrationPage/GeneralAdministration'
import InstanceAdministration from 'PAGES/AdministrationPage/InstanceAdministration.jsx'
import React from 'react'
import TransactionAdministration from 'PAGES/AdministrationPage/TransactionAdministration.jsx'
import UserAdministration from 'PAGES/AdministrationPage/UserAdministration.jsx'
import AdministrationPage from 'PAGES/AdministrationPage/AdministrationPage.jsx'
import sinon from 'sinon'

const defaultInstance = {
  subdomain: 'testdomain',
  root: 'testroot',
  id: 1,
  icon: 'fa-test',
  title: 'testtitle',
}

function createShallow({
  user = { id: 1, instance: 1 },
  sign_out = sinon.spy(),
  instance = defaultInstance,
  setAdmin = sinon.spy(),
  deleteUser = sinon.spy(),
  validateGmail = sinon.spy(),
  saveGmail = sinon.spy(),
  saveInstanceData = sinon.spy(),
  loadInstance = sinon.spy(),
  loadAllUsers = sinon.spy(),
  loadAllTransactions = sinon.spy(),
}) {
  const props = { user, sign_out, instance, setAdmin, deleteUser, validateGmail, saveGmail, saveInstanceData, loadInstance, loadAllUsers, loadAllTransactions }

  return { component: shallow(<AdministrationPage {...props} />), props }
}

describe('AdministrationPage', () => {
  test('should not test anything', () => {
    const { component, props } = createShallow({})
    component.find('.quicklinks > li').simulate('click')
    expect(props.sign_out.calledOnce).toBeTruthy()

    expect(component.find(GeneralAdministration)).toHaveLength(1)
    expect(component.find(InstanceAdministration)).toHaveLength(0)
    expect(component.find(TransactionAdministration)).toHaveLength(0)
    expect(component.find(UserAdministration)).toHaveLength(0)

    component
      .find('.filter')
      .at(1)
      .simulate('click')
    expect(props.loadAllUsers.calledOnce).toBeTruthy()
    component.update()

    expect(component.find(GeneralAdministration)).toHaveLength(0)
    expect(component.find(InstanceAdministration)).toHaveLength(0)
    expect(component.find(TransactionAdministration)).toHaveLength(0)
    expect(component.find(UserAdministration)).toHaveLength(1)

    component
      .find('.filter')
      .at(2)
      .simulate('click')
    expect(props.loadAllTransactions.calledOnce).toBeTruthy()
    component.update()

    expect(component.find(GeneralAdministration)).toHaveLength(0)
    expect(component.find(InstanceAdministration)).toHaveLength(0)
    expect(component.find(TransactionAdministration)).toHaveLength(1)
    expect(component.find(UserAdministration)).toHaveLength(0)

    component
      .find('.filter')
      .at(3)
      .simulate('click')
    component.update()

    expect(component.find(GeneralAdministration)).toHaveLength(0)
    expect(component.find(InstanceAdministration)).toHaveLength(1)
    expect(component.find(TransactionAdministration)).toHaveLength(0)
    expect(component.find(UserAdministration)).toHaveLength(0)

    sinon.stub(window.location, 'assign')

    component.find('.instanceTitle').simulate('click')

    expect(window.location.assign.calledOnce).toBeTruthy()
    expect(window.location.assign.lastCall.args[0]).toEqual('https://testdomain.fochlac.com/')

    component.setProps({
      instance: {
        ...defaultInstance,
        subdomain: ''
      },
    })

    component.find('.instanceTitle').simulate('click')

    expect(window.location.assign.lastCall.args[0]).toEqual('testroot/1')
  })
})
