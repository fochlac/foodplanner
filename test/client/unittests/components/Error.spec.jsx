import { mount, shallow } from 'enzyme'

import Error from 'CONNECTED/Error/Error.jsx'
import React from 'react'

const ERROR_MESSAGE = 'testmessage'
let delete_error_called = false

describe('Error', () => {
  test('should render an element with an error message and call delete function on click to close button', () => {
    const wrapper = shallow(<Error error={ERROR_MESSAGE} delete_error={() => (delete_error_called = true)} />),
      message = wrapper.find('p'),
      close = wrapper.find('span.fa-times')

    expect(message.length).toBe(1)
    expect(close.length).toBe(1)

    close.simulate('click')

    expect(message.text()).toBe(ERROR_MESSAGE)
    expect(delete_error_called).toBe(true)
  })

  test('should close on ESC-press', () => {
    delete_error_called = false

    let eventListener,
      tmp = window.addEventListener

    window.addEventListener = (evt, fn) => (eventListener = fn)

    const wrapper = shallow(<Error error={ERROR_MESSAGE} delete_error={() => (delete_error_called = true)} />)

    eventListener({ keyCode: 27 })
    expect(delete_error_called).toBe(true)

    delete_error_called = false

    eventListener({ keyCode: 28 })
    expect(delete_error_called).toBe(false)

    window.addEventListener = tmp

    tmp = window.removeEventListener
    window.removeEventListener = (evt, fn) => (eventListener = evt)
    wrapper.unmount()
    expect(eventListener).toBe('keyup')
    window.removeEventListener = tmp
  })
})
