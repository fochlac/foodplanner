import React from 'react';
import { shallow, mount } from 'enzyme';
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker.jsx';
import { formatDate, formatTime, round } from 'UTILS/date.js'

import DayPickerInput from 'react-day-picker/DayPickerInput'

describe('DayTimePicker', () => {
  test('should render the complete element with correct date', () => {
    const wrapper = shallow(<DayTimePicker />);

    expect(wrapper.find('.DayPicker')).toHaveLength(1);
    expect(wrapper.find('.DayPickerInput').length).toEqual(0);
    expect(wrapper.find(DayPickerInput).length).toEqual(1);
    expect(wrapper.find('.timePicker')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(0);

    expect(wrapper.find(DayPickerInput).prop('value')).toEqual(formatDate(Date.now()));
    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(Date.now(), 30 * 60)));

  });

  test('should render the complete element with submit button and disabled state with correct date', () => {
    const time = Date.now() + 100000
    const wrapper = shallow(<DayTimePicker onSubmit={() => null} disabled={true} className={'test'} time={time}/>);

    expect(wrapper.find('.test')).toHaveLength(1);
    expect(wrapper.find(DayPickerInput).length).toEqual(0);
    expect(wrapper.find('.DayPickerInput').length).toEqual(1);
    expect(wrapper.find('.timePicker')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(1);

    expect(wrapper.find('.DayPickerInput').prop('value')).toEqual(formatDate(time));
    expect(wrapper.find('.timePicker').prop('value')).toEqual(formatTime(round(time, 30 * 60)));
  });

  test('should handle timechange', () => {
    let input,
        output
    const wrapper = shallow(<DayTimePicker onChange={date => output = date} />)
    const onChange = wrapper
      .find(DayPickerInput)
      .prop('onDayChange')


    onChange({
      toDate: () => {
        input = new Date()
        return input
      },
    })

    expect(input).toEqual(output)


    wrapper
      .find('.timePicker')
      .simulate('change', { target: { value: '16:00' } })

    input.setHours(16)
    input.setMinutes(0)
    expect(input).toEqual(output)
  })

  test('should handle timechange for submit', () => {
    let input,
        output
    const wrapper = shallow(<DayTimePicker onSubmit={date => output = date} />)
    const changeDate = wrapper
      .find(DayPickerInput)
      .prop('onDayChange')


    changeDate({
      toDate: () => {
        input = new Date()
        return input
      },
    })

    expect(output).toEqual(undefined)


    wrapper
    .find('.timePicker')
    .simulate('change', { target: { value: '16:00' } })

    input.setHours(16)
    input.setMinutes(0)
    expect(output).toEqual(undefined)
    wrapper.find('button').simulate('click')

    expect(input).toEqual(output)
  })
});
