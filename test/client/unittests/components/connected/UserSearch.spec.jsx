import { mount, shallow } from 'enzyme'

import React from 'react'
import UserSearch from 'CONNECTED/UserSearch/UserSearch.jsx'
import sinon from 'sinon'

describe('UserSearch', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => jest.useRealTimers())
  test('should render an input', () => {
    const TEST_ID = 'testid123',
      wrapper = shallow(<UserSearch id={TEST_ID} app={{ hiddenBusy: false }} />)

    expect(wrapper.find('input').length).toBe(1)
    expect(wrapper.find('input').is('#' + TEST_ID)).toBe(true)
    expect(wrapper.find('span.fa-spinner.invisible').length).toBe(1)
  })

  test('should display the spinner when app.hiddenBusy is true', () => {
    const wrapper = shallow(<UserSearch id="test" app={{ hiddenBusy: true, busyList: ['searchUser'] }} />)

    expect(wrapper.find('input').length).toBe(1)
    expect(wrapper.find('span.fa-spinner').length).toBe(1)
    expect(wrapper.find('span.fa-spinner').hasClass('invisible')).toBe(false)
  })

  test('should trigger check mail function at 1. character', () => {
    let check_mail_value = 'undef'
    const wrapper = shallow(
      <UserSearch
        id="test"
        app={{ hiddenBusy: true, busyList: [] }}
        searchUser={str => {
          check_mail_value = str.length
        }}
      />,
    )

    wrapper.find('input').simulate('change', { target: { value: '' } })

    expect(check_mail_value).toBe('undef')
    wrapper.find('input').simulate('change', { target: { value: 'te' } })

    expect(check_mail_value).toBe(2)
  })

  test('should render mail in input', () => {
    let check_mail_value = 0,
      output

    const wrapper = shallow(
      <UserSearch
        app={{ hiddenBusy: false }}
        searchUser={value => {
          check_mail_value = value.length
        }}
      />,
    )

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(check_mail_value).toBe(4)
    wrapper.find('input').simulate('change', { target: { value: 'test12' } })
    expect(check_mail_value).toBe(4)
    wrapper.find('input').simulate('focus')

    jest.advanceTimersByTime(1000)

    expect(check_mail_value).toBe(6)

    jest.advanceTimersByTime(1000)
    wrapper.setProps({ app: { hiddenBusy: false, userSuggestions: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }, { id: 3, name: 'test3' }] } })

    jest.advanceTimersByTime(1000)
    expect(wrapper.find('.dropdown')).toHaveLength(1)
    expect(wrapper.find('.dropdown > li')).toHaveLength(3)
    wrapper
      .find('.dropdown > li')
      .at(1)
      .simulate('click')
    expect(wrapper.find('.dropdown')).toHaveLength(0)
    wrapper.find('input').simulate('focus')
    expect(wrapper.find('.dropdown')).toHaveLength(1)
    expect(wrapper.find('input').prop('value')).toBe('test2')
    wrapper.find('input').simulate('blur')
    jest.advanceTimersByTime(1000)
    wrapper.update()
    expect(wrapper.find('.dropdown')).toHaveLength(0)

    const to = sinon.stub(window, 'clearTimeout')

    wrapper.unmount()

    expect(to.calledOnce).toBeTruthy()
  })
})
