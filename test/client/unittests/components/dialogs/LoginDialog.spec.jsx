import { mount, shallow } from 'enzyme'

import Dialog from 'DIALOG/Dialog.js'
import InputRow from 'RAW/InputRow.jsx'
import LoginDialog from 'DIALOG/LoginDialog/LoginDialog.jsx'
import React from 'react'

let output
const user = {
    id: 1,
    name: 'test',
    admin: true,
    balance: 10,
  },
  user2 = {
    id: 1,
    name: 'test',
    admin: false,
    balance: undefined,
  },
  actions = {
    sign_in: data => (output = { data, type: 'sign_in' }),
    register: data => (output = { data, type: 'register' }),
    reset_password: data => (output = { data, type: 'reset_password' }),
  }

describe('LoginDialog', () => {
  test('should render a unregistered frame and switch between register / signin', () => {
    const wrapper = shallow(<LoginDialog {...actions} />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.titlebar h3').text()).toBe('Anmelden')

    wrapper.find('.registerLink').simulate('click')
    expect(wrapper.find('.titlebar h3').text()).toBe('Registrieren')

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true)

    wrapper.find('.signinLink').simulate('click')

    expect(wrapper.find('.registerLink')).toHaveLength(1)
    expect(wrapper.find('.foot button')).toHaveLength(1)

    wrapper.find('.forgotPW').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  test('test forgot pw', async () => {
    const wrapper = shallow(<LoginDialog {...actions} />)
    wrapper.find('.forgotPW').simulate('click')
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true)
    wrapper.find(InputRow).prop('onChange')('asd@asd.de')
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.submit').prop('disabled')).toBe(false)
    wrapper.find('.foot button').simulate('click')
    expect(output.data).toEqual('asd@asd.de')
    expect(output.type).toBe('reset_password')
  })

  test('error handling test', () => {
    const wrapper = shallow(<LoginDialog {...actions} />)
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true)
    wrapper.find('.registerLink').simulate('click')

    // test mail + name

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('asd')

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('a')
    wrapper.update()
    expect(wrapper).toMatchSnapshot()

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('asd@asd.de')

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('aasd')
    wrapper.update()
    expect(wrapper).toMatchSnapshot()

    // test password

    wrapper
      .find(InputRow)
      .at(2)
      .prop('onChange')('asd')

    wrapper
      .find(InputRow)
      .at(3)
      .prop('onChange')('asda')
    wrapper.update()
    expect(wrapper).toMatchSnapshot()

    wrapper
      .find(InputRow)
      .at(3)
      .prop('onChange')('asd')
    wrapper.update()
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.signinLink').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.registerLink').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  test('should output correct data on login / register', () => {
    const wrapper = shallow(<LoginDialog {...actions} />)

    window.crypto = {
      subtle: {
        importKey: () => ({
          then: () => ({
            then: () => ({
              then: () => ({
                then: cb => {
                  cb('ALeLYLKK1Wtl/1TQlW/oEA')
                  return { catch: () => null }
                },
              }),
            }),
          }),
        }),
      },
    }
    window.TextEncoder = function() {
      return { encode: () => null }
    }

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('asd@asd.de')

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('asd')
    wrapper.update()

    wrapper.find('.foot button').simulate('click')

    expect(output.data).toEqual({ mail: 'asd@asd.de', hash: 'ALeLYLKK1Wtl/1TQlW/oEA' })
    expect(output.type).toBe('sign_in')

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('')
    wrapper.update()

    wrapper.find('.foot button').simulate('click')

    expect(output.data).toEqual({ mail: 'asd@asd.de', hash: undefined })
    expect(output.type).toBe('sign_in')

    wrapper.find('.registerLink').simulate('click')
    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('asd@asd.de')

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('asd')

    wrapper
      .find(InputRow)
      .at(2)
      .prop('onChange')('asd')

    wrapper
      .find(InputRow)
      .at(3)
      .prop('onChange')('asd')
    wrapper.update()
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false)
    wrapper.find('.foot button').simulate('click')

    expect(output.type).toBe('register')
    expect(output.data).toEqual({
      hash: 'ALeLYLKK1Wtl/1TQlW/oEA',
      mail: 'asd@asd.de',
      name: 'asd',
    })

    wrapper
      .find(InputRow)
      .at(2)
      .prop('onChange')('')
    wrapper.update()
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false)
    wrapper.find('.foot button').simulate('click')
    expect(output.data).toEqual({
      hash: undefined,
      mail: 'asd@asd.de',
      name: 'asd',
    })

    output = false
    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')('asdasdw')
    wrapper.update()
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true)
    wrapper.find('.foot button').simulate('click')
    expect(output).toEqual(false)
  })

  test('should submit on ENTER-press', () => {
    let eventListener,
      tmp = window.addEventListener

    window.addEventListener = (evt, fn) => (eventListener = fn)

    const wrapper = shallow(<LoginDialog {...actions} />)
    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('asd@asd.de')

    wrapper.update()

    eventListener({ keyCode: 13 })

    expect(output.data).toEqual({ mail: 'asd@asd.de', hash: undefined })
    expect(output.type).toBe('sign_in')

    output = false
    eventListener({ keyCode: 27 })
    expect(output).toBe(false)

    window.addEventListener = tmp

    tmp = window.removeEventListener
    window.removeEventListener = (evt, fn) => (eventListener = evt)
    wrapper.unmount()
    expect(eventListener).toBe('keyup')
    window.removeEventListener = tmp
  })
})
