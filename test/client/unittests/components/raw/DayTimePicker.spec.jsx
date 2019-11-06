import { formatDate, formatTime, round } from 'UTILS/date.js'
import { mount, shallow } from 'enzyme'

import DatePicker from '@reaktor/react-pikaday-component'
import DayTimePicker from 'RAW/DayTimePicker.jsx'
import React from 'react'

describe('DayTimePicker', () => {
  test('should render the complete element with correct date', () => {
    const wrapper = shallow(<DayTimePicker />)

    expect(wrapper.find('.DayPicker')).toHaveLength(1)
    expect(wrapper.find('.DayPickerInput').length).toEqual(0)
    expect(wrapper.find(DatePicker).length).toEqual(1)
    expect(wrapper.find('.timePicker')).toHaveLength(1)
    expect(wrapper.find('button')).toHaveLength(0)

    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(Date.now(), 15 * 60)))
  })

  test('should render the complete element with submit button and disabled state with correct date', () => {
    const time = Date.now() + 100000
    const wrapper = shallow(<DayTimePicker onSubmit={() => null} disabled={true} className={'test'} time={time} />)

    expect(wrapper.find('.test')).toHaveLength(1)
    expect(wrapper.find(DatePicker).length).toEqual(0)
    expect(wrapper.find('.DayPickerInput').length).toEqual(1)
    expect(wrapper.find('.timePicker')).toHaveLength(1)
    expect(wrapper.find('button')).toHaveLength(1)

    expect(wrapper.find('.DayPickerInput').prop('value')).toEqual(formatDate(time))
    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(time, 15 * 60)))
  })

  test('should handle timechange', () => {
    let input, output
    const wrapper = shallow(<DayTimePicker onChange={date => (output = date)} />)
    const onChange = wrapper.find(DatePicker).prop('onChange')

    input = new Date()
    onChange(input)

    expect(input).toEqual(output)

    wrapper.find('.timePicker').simulate('change', { target: { value: '16:00' } })

    input.setHours(16)
    input.setMinutes(0)
    expect(input).toEqual(output)
  })

  test('should update time on propschange', () => {
    const time = Date.now() + 100000
    const time2 = Date.now() + 2100000
    const wrapper = shallow(<DayTimePicker onSubmit={() => null} disabled={true} className={'test'} time={time} />)

    expect(wrapper.find('.DayPickerInput').prop('value')).toEqual(formatDate(time))
    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(time, 15 * 60)))

    wrapper.setProps({ time: time2 })
    wrapper.update()

    expect(wrapper.find('.DayPickerInput').prop('value')).toEqual(formatDate(time2))
    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(time2, 15 * 60)))
  })

  test('should handle timechange for submit', () => {
    let input, output
    const wrapper = shallow(<DayTimePicker onSubmit={date => (output = date)} />)
    const changeDate = wrapper.find(DatePicker).prop('onChange')

    input = new Date()
    changeDate(input)

    expect(output).toEqual(undefined)

    wrapper.find('.timePicker').simulate('change', { target: { value: '16:00' } })

    input.setHours(16)
    input.setMinutes(0)
    expect(output).toEqual(undefined)
    wrapper.find('button').simulate('click')

    expect(input).toEqual(output)
  })
})
