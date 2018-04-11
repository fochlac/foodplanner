import { mount, shallow } from 'enzyme'

import AddressBlock from 'RAW/AddressBlock.jsx'
import InputRow from 'RAW/InputRow.jsx'
import React from 'react'
import sinon from 'sinon'

function createWrapper({
  value = {
    street: 'teststreet',
    number: 1,
    postal: 12345,
    city: 'testcity',
    country: 'testcountry',
  },
  onChange = sinon.spy(),
  onBlur = sinon.spy(),
  required = true,
}) {
  const props = { value, onChange, onBlur, required }
  const wrapper = shallow(<AddressBlock {...props} />)

  return { wrapper, props }
}

describe('AddressBlock', () => {
  test('should correctly set initial state', () => {
    const { wrapper, props } = createWrapper({})
    const wrapper2 = shallow(<AddressBlock />)

    expect(wrapper2.state('isValid')).toBeFalsy()
    expect(wrapper2.state('address')).toEqual({
      street: '',
      number: '',
      postal: '',
      city: '',
      country: '',
    })

    expect(wrapper.state('isValid')).toBeTruthy()
    expect(wrapper.state('address')).toEqual(props.value)
  })

  test('should correctly trigger callbacks', async () => {
    const { wrapper, props } = createWrapper({ value: null })

    expect(wrapper.state('isValid')).toBeFalsy()
    expect(wrapper.state('address')).toEqual({
      street: '',
      number: '',
      postal: '',
      city: '',
      country: '',
    })

    wrapper
      .find(InputRow)
      .at(0)
      .prop('onChange')('teststreet', true)

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: '',
        postal: '',
        city: '',
        country: '',
      },
      false,
    ])

    wrapper
      .find(InputRow)
      .at(1)
      .prop('onChange')(1, true)

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: '',
        city: '',
        country: '',
      },
      false,
    ])

    wrapper
      .find(InputRow)
      .at(2)
      .prop('onChange')(12345, true)

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: '',
        country: '',
      },
      false,
    ])

    wrapper
      .find(InputRow)
      .at(3)
      .prop('onChange')('testcity', true)

    wrapper
      .find(InputRow)
      .at(3)
      .prop('onBlur')()

    expect(props.onBlur.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: '',
      },
      false,
    ])

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: '',
      },
      false,
    ])

    wrapper
      .find(InputRow)
      .at(4)
      .prop('onChange')('testcountry', true)

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: 'testcountry',
      },
      true,
    ])

    wrapper
      .find(InputRow)
      .at(4)
      .prop('onBlur')()

    expect(props.onBlur.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: 'testcountry',
      },
      true,
    ])

    wrapper
      .find(InputRow)
      .at(4)
      .prop('onChange')('', false)

    expect(props.onChange.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: '',
      },
      false,
    ])

    wrapper
      .find(InputRow)
      .at(4)
      .prop('onBlur')()

    expect(props.onBlur.lastCall.args).toEqual([
      {
        street: 'teststreet',
        number: 1,
        postal: 12345,
        city: 'testcity',
        country: '',
      },
      false,
    ])
  })
})
