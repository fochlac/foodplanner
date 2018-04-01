import { mount, shallow } from 'enzyme'

import InputRow from 'RAW/InputRow.jsx'
import React from 'react'

describe('InputRow', () => {
  test('should render the complete element', () => {
    const wrapper = shallow(<InputRow label="test1" />)

    expect(wrapper.find('.fullWidth')).toHaveLength(1)
    expect(wrapper.find('.required')).toHaveLength(1)
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('value')).toEqual('')
    expect(wrapper.find('input').prop('type')).toEqual('text')
    expect(wrapper.find('input').prop('id')).toContain('input_')
    expect(wrapper.find('input').prop('className')).toEqual('')
    expect(wrapper.find('label').text()).toContain('test1')
  })

  test('should render the complete element with correct date', () => {
    const wrapper = shallow(<InputRow label="test1" defaultValue="test" type="number" id="test2" valid={false} />)

    expect(wrapper.find('.fullWidth')).toHaveLength(1)
    expect(wrapper.find('.required')).toHaveLength(1)
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('value')).toEqual('test')
    expect(wrapper.find('input').prop('type')).toEqual('number')
    expect(wrapper.find('input').prop('id')).toEqual('test2')
    expect(wrapper.find('input').prop('className')).toEqual('invalid')
  })

  test('should handle input', () => {
    let output
    const wrapper = shallow(<InputRow label="test1" onChange={(value, isValid) => (output = { value, isValid })} />)

    wrapper.find('input').simulate('change', { target: { value: 'hallo' } })

    expect(output.value).toEqual('hallo')
    expect(output.isValid).toEqual(true)
  })

  test('should handle onBlur', () => {
    let output
    const wrapper = shallow(<InputRow label="test1" onBlur={(value, isValid) => (output = { value, isValid })} />)

    wrapper.find('input').simulate('change', { target: { value: 'hallo' } })
    wrapper.find('input').simulate('blur')

    expect(output.value).toEqual('hallo')
    expect(output.isValid).toEqual(true)
  })

  test('should validate onChange and onBlur', () => {
    let output, output2
    const wrapper = shallow(
      <InputRow
        label="test1"
        onBlur={(value, isValid) => (output = { value, isValid })}
        onChange={(value, isValid) => (output2 = { value, isValid })}
        userInterface={/^[a-z]*$/}
      />,
    )

    wrapper.find('input').simulate('change', { target: { value: 'Hallo' } })
    expect(output2.value).toEqual('Hallo')
    expect(output2.isValid).toEqual(false)

    wrapper.find('input').simulate('blur')
    expect(output.value).toEqual('Hallo')
    expect(output.isValid).toEqual(false)

    wrapper.find('input').simulate('change', { target: { value: 'hallo123' } })
    expect(output2.value).toEqual('hallo123')
    expect(output2.isValid).toEqual(false)

    wrapper.find('input').simulate('change', { target: { value: 'hallo' } })
    expect(output2.value).toEqual('hallo')
    expect(output2.isValid).toEqual(true)

    wrapper.find('input').simulate('blur')
    expect(output.value).toEqual('hallo')
    expect(output.isValid).toEqual(true)
  })
})
