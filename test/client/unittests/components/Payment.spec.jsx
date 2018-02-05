import { mount, shallow } from 'enzyme'

import Payment from 'UI/PriceDialog/Payment.jsx'
import React from 'react'

describe('Payment', () => {
  test('should render all elements', () => {
    const signups = [
        { name: 'test1', price: 10, paid: 0, userId: 2 },
        { name: 'test2', price: 5, paid: 1 },
        { name: 'test3', price: 10, paid: 1 },
        { name: 'test4', paid: 1 },
      ],
      wrapper = shallow(<Payment signups={signups} />)

    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find('.body table').length).toBe(1)
    expect(wrapper.find('.body tbody tr').length).toBe(3)
    expect(wrapper.find('.body tbody tr td.name').length).toBe(3)
    wrapper.find('.body tbody tr td.name').forEach((node, index) => expect(node.text()).toContain(signups[index].name))
    wrapper.find('.body tbody tr td.price').forEach((node, index) => expect(node.text()).toContain(signups[index].price ? signups[index].price : 'unbekannt'))
    wrapper.find('.body tbody tr td.paid').forEach((node, index) => expect(node.find('.fa-check').length).toBe(signups[index].paid))
    wrapper.find('.body tbody tr td.paid').forEach((node, index) => expect(node.find(signups[index].userId ? '.col_green' : '.col_red').length).toBe(1))
  })

  test('should set checked element invalit and vice versa', () => {
    const signups = [{ id: 0, name: 'test1', price: 10, paid: 0 }, { id: 1, name: 'test2', price: 5, paid: 1 }],
      wrapper = shallow(
        <Payment
          signups={signups}
          toggle_paid={(id, state) => {
            expect(state).toBe(!signups.find(signup => signup.id === id).paid)
          }}
        />,
      )

    wrapper
      .find('.state')
      .at(0)
      .simulate('click')
    wrapper
      .find('.state')
      .at(1)
      .simulate('click')
  })
})
