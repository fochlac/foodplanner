import { mount, shallow } from 'enzyme'

import IncomingPaymentsDialog from 'DIALOG/IncomingPaymentsDialog/IncomingPaymentsDialog.jsx'
import Payment from 'DIALOG/PriceDialog/Payment.jsx'
import React from 'react'

describe('IncomingPaymentsDialog', () => {
  beforeAll(() => {
    Date.now = () => 123456789123
  })

  test('should render all elements', () => {
    let output
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[]}
        userId="1"
        signups={{}}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
        load_history={() => (output = true)}
      />,
    )

    expect(output).toBe(true)
    expect(wrapper.find('.titlebar').length).toBe(1)
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find(Payment).length).toBe(0)
    expect(wrapper.find('.foot button').length).toBe(1)
    expect(wrapper.find('.foot').length).toBe(1)
  })

  test('should input correct meals to payment', () => {
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[{ creatorId: '1', id: 1, time: Date.now() }, { creatorId: '2', id: 2, time: Date.now() }]}
        userId="1"
        signups={{
          1: { meal: 1, price: 2, paid: 0, id: 1 },
          2: { meal: 2, price: 2, paid: 0, id: 2 },
          3: { meal: 1, price: 2, paid: 1, id: 3 },
          4: { meal: 1, price: 2, paid: 0, id: 4 },
        }}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
        load_history={() => null}
      />,
    )

    expect(wrapper.find(Payment).length).toBe(1)
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, price: 2, paid: 0, id: 1 }, { meal: 1, price: 2, paid: 0, id: 4 }])

    wrapper.setProps({
      signups: {
        1: { meal: 1, price: 2, paid: 1, id: 1 },
        2: { meal: 2, price: 2, paid: 0, id: 2 },
        3: { meal: 1, price: 2, paid: 1, id: 3 },
        4: { meal: 1, price: 2, paid: 0, id: 4 },
      },
    })
    wrapper.update()
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, price: 2, paid: 1, id: 1 }, { meal: 1, price: 2, paid: 0, id: 4 }])
    wrapper.setProps({ userId: 2 })
    wrapper.update()
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, price: 2, paid: 1, id: 1 }, { meal: 1, price: 2, paid: 0, id: 4 }])
  })

  test('should input correct meals to payment', () => {
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[{ creatorId: '1', id: 1, time: Date.now() }, { creatorId: '2', id: 2, time: Date.now() }]}
        userId="1"
        signups={{
          1: { meal: 1, price: 2, paid: 0, id: 1 },
          2: { meal: 2, price: 2, paid: 0, id: 2 },
          3: { meal: 1, price: 2, paid: 1, id: 3 },
          4: { meal: 1, price: 0, paid: 0, id: 4 },
        }}
        toggle_paid={() => null}
        load_history={() => null}
        close_dialog={() => (dialog_closed = true)}
      />,
    )

    expect(wrapper.find(Payment).length).toBe(1)
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, price: 2, paid: 0, id: 1 }])
  })

  test('should input correct meal to auto payment', () => {
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[{ creatorId: '1', id: 1, time: Date.now() }, { creatorId: '2', id: 2, time: Date.now() }]}
        userId="1"
        signups={{
          1: { meal: 1, price: 2, paid: 0, id: 1 },
          2: { meal: 2, price: 2, paid: 0, id: 2 },
          3: { meal: 1, price: 2, paid: 1, id: 3 },
          4: { meal: 1, price: 0, paid: 0, id: 4 },
        }}
        toggle_paid={() => null}
        load_history={() => null}
        close_dialog={() => (dialog_closed = true)}
      />,
    )

    expect(wrapper.find(Payment).length).toBe(1)
    expect(wrapper.find(Payment).prop('signups')).toEqual([{ meal: 1, price: 2, paid: 0, id: 1 }])
  })

  test('should close on close button click', () => {
    let dialog_closed = false

    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[]}
        userId="1"
        signups={{}}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
        load_history={() => null}
      />,
    )
    wrapper.find('.titlebar span.fa-times').simulate('click')

    expect(dialog_closed).toBe(true)
  })

  test('should update list if new meals are added', () => {
    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[]}
        userId="1"
        signups={{}}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
        load_history={() => null}
      />,
    )

    wrapper.setProps({
      signups: {
        1: { meal: 1, price: 2, paid: 1, id: 1 },
        2: { meal: 2, price: 2, paid: 0, id: 2 },
        3: { meal: 1, price: 2, paid: 1, id: 3 },
        4: { meal: 1, price: 2, paid: 0, id: 4 },
      },
      meals: [{ creatorId: '1', id: 1, time: Date.now() }, { creatorId: '2', id: 2, time: Date.now() }],
    })

    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  test('should close on cancel button click', () => {
    let dialog_closed = false

    const wrapper = shallow(
      <IncomingPaymentsDialog
        meals={[]}
        userId="1"
        signups={{}}
        toggle_paid={() => null}
        close_dialog={() => (dialog_closed = true)}
        load_history={() => null}
      />,
    )
    wrapper.find('.foot button.cancel').simulate('click')

    expect(dialog_closed).toBe(true)
  })
})
