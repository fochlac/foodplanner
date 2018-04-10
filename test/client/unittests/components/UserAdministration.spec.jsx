import { mount, shallow } from 'enzyme'

import Pager from 'RAW/Pager.jsx'
import React from 'react'
import UserAdministration from 'PAGES/AdministrationPage/UserAdministration.jsx'
import sinon from 'sinon'

const testdata = [
  { id: 1, name: 'admin', admin: 1, mail: 'admin@test.de', balance: -212.1, deadlineReminder: 0, creationNotice: 0, instance: 1 },
  { id: 2, name: 'tester', admin: 0, mail: 'tester@test.de', balance: 0, deadlineReminder: 0, creationNotice: 0, instance: 1 },
  { id: 4, name: 'testuser1', admin: 1, mail: 'test@test.de', balance: 97.3, deadlineReminder: 0, creationNotice: 0, instance: 1 },
  { id: 5, name: 'testuser2', admin: 0, mail: 'test2@test.de', balance: 114.8, deadlineReminder: 0, creationNotice: 0, instance: 1 },
]

const userActions = { setAdmin: sinon.spy(), deleteUser: sinon.spy() }

describe('UserAdministration', () => {
  test('should correctly render data', () => {
    const wrapper = shallow(<UserAdministration users={testdata} self={1} {...userActions} />)
    expect(wrapper.find('tr')).toHaveLength(4)
    expect(
      wrapper
        .find('tr')
        .at(0)
        .find('td'),
    ).toHaveLength(5)

    testdata.forEach((row, index) => {
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(0)
          .text(),
      ).toContain(row.name)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(1)
          .text(),
      ).toContain(row.mail)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(2)
          .text(),
      ).toContain(row.balance)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(3)
          .text(),
      ).toContain(row.admin ? 'Administrator' : 'Nutzer')
    })

    expect(wrapper.find('.fa-trash')).toHaveLength(3)

    const outer = shallow(wrapper.find(Pager).prop('wrapper')())

    expect(outer.find('th')).toHaveLength(5)
  })

  test('should correctly render empty state', () => {
    const wrapper = shallow(<UserAdministration users={testdata} {...userActions} />)

    wrapper
      .find('tr')
      .at(1)
      .find('.fa-level-up')
      .simulate('click')

    expect(userActions.setAdmin.calledOnceWith({ user: 2, admin: true })).toBeTruthy()

    wrapper
      .find('tr')
      .at(2)
      .find('.fa-level-down')
      .simulate('click')
    expect(userActions.setAdmin.lastCall.calledWith({ user: 4, admin: false })).toBeTruthy()

    wrapper
      .find('tr')
      .at(1)
      .find('.fa-trash')
      .simulate('click')

    expect(userActions.deleteUser.calledOnceWith({ user: 2 })).toBeTruthy()
  })
})
