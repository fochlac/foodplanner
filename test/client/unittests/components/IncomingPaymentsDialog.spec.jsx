import { mount, shallow } from 'enzyme'

import IncomingPaymentsDialog from 'UI/IncomingPaymentsDialog/IncomingPaymentsDialog.jsx'
import Payment from 'UI/PriceDialog/Payment.jsx'
import React from 'react'

describe('IncomingPaymentsDialog', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<IncomingPaymentsDialog meals={[]} userId="1" signups={{}} toggle_paid={() => null} close_dialog={() => (dialog_closed = true)} />)

    expect(wrapper.find('.titlebar').length).toBe(1)
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find(Payment).length).toBe(1)
    expect(wrapper.find('.foot button').length).toBe(1)
    expect(wrapper.find('.foot').length).toBe(1)
  })

  test('should input correct meals to payment', () => {
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[{ creatorId: '1', id: 1 }, { creatorId: '2', id: 2 }]}
        userId="1"
        signups={{ 1: { meal: 1, paid: 0, id: 1 }, 2: { meal: 2, paid: 0, id: 2 }, 3: { meal: 1, paid: 1, id: 3 }, 4: { meal: 1, paid: 0, id: 4 } }}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
      />,
    )

    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, paid: 0, id: 1 }, { meal: 1, paid: 0, id: 4 }])

    wrapper.setProps({
      signups: { 1: { meal: 1, paid: 1, id: 1 }, 2: { meal: 2, paid: 0, id: 2 }, 3: { meal: 1, paid: 1, id: 3 }, 4: { meal: 1, paid: 0, id: 4 } },
    })
    wrapper.update()
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, paid: 1, id: 1 }, { meal: 1, paid: 0, id: 4 }])
    wrapper.setProps({ userId: 2 })
    wrapper.update()
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, paid: 1, id: 1 }, { meal: 1, paid: 0, id: 4 }])
  })

  test('should close on close button click', () => {
    let dialog_closed = false

    const wrapper = shallow(<IncomingPaymentsDialog meals={[]} userId="1" signups={{}} toggle_paid={() => null} close_dialog={() => (dialog_closed = true)} />)
    wrapper.find('.titlebar span.fa-times').simulate('click')

    expect(dialog_closed).toBe(true)
  })

  test('should close on cancel button click', () => {
    let dialog_closed = false

    const wrapper = shallow(<IncomingPaymentsDialog meals={[]} userId="1" signups={{}} toggle_paid={() => null} close_dialog={() => (dialog_closed = true)} />)
    wrapper.find('.foot button.cancel').simulate('click')

    expect(dialog_closed).toBe(true)
  })
})
