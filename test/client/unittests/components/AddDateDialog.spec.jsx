import { mount, shallow } from 'enzyme'

import AddDateDialog from 'UI/AddDateDialog/AddDateDialog.jsx'
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker.jsx'
import React from 'react'

describe('AddDateDialog', () => {
  test('should render all elements', () => {
    const TEST_TITLE = 'testid123',
      TEST_TEXT = 'test test test test test',
      wrapper = shallow(<AddDateDialog test={() => (action_called = true)} close_dialog={() => (dialog_closed = true)} />)

    expect(wrapper.find('.titlebar').length).toBe(1)
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find('.foot').length).toBe(1)
    expect(wrapper.find(DayTimePicker).length).toBe(1)
    expect(wrapper.find('.foot button').length).toBe(2)
  })

  test('should properly submit', () => {
    let dialog_closed = false
    let action_called = false

    const wrapper = shallow(
      <AddDateDialog datefinder={2} datefinderAddDate={data => (action_called = data)} noCancel={false} close_dialog={() => (dialog_closed = true)} />,
    )

    const props = wrapper.find(DayTimePicker).props('onChange')
    const date = new Date(Date.now() + 10000)

    props.onChange(date)

    wrapper.find('button.submit').simulate('click')

    expect(action_called).toEqual({ datefinder: 2, time: date.getTime() })
  })

  test('should not submit without datefinder', () => {
    let dialog_closed = false
    let action_called = false

    const wrapper = shallow(<AddDateDialog datefinderAddDate={data => (action_called = data)} noCancel={false} close_dialog={() => (dialog_closed = true)} />)

    const props = wrapper.find(DayTimePicker).props('onChange')
    const date = new Date(Date.now() + 10000)

    props.onChange(date)

    wrapper.find('button.submit').simulate('click')

    expect(action_called).toBe(false)
  })

  test('should close on cancel button click', () => {
    let dialog_closed = false
    let action_called = false

    const wrapper = shallow(<AddDateDialog test={() => (action_called = true)} noCancel={false} close_dialog={() => (dialog_closed = true)} />)

    wrapper.find('button.cancel').simulate('click')

    expect(dialog_closed).toBe(true)
  })

  test('should close on close button click', () => {
    let dialog_closed = false

    const wrapper = shallow(<AddDateDialog test={() => (action_called = true)} noCancel={false} close_dialog={() => (dialog_closed = true)} />)

    wrapper.find('.titlebar span.fa-times').simulate('click')

    expect(dialog_closed).toBe(true)
  })
})
