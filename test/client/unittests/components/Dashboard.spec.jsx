import { mount, shallow } from 'enzyme'

import Dashboard from 'PAGES/Dashboard/Dashboard.jsx'
import Meal from 'UI/Meal.js'
import Pager from 'UI/Pager/Pager.jsx'
import React from 'react'
import UserFrame from 'UI/UserFrame.js'

let output

const options = {
  meals: [{ id: 1, time: Date.now() + 1000000 }, { id: 3, time: Date.now() - 1000000000 }, { id: 2, time: Date.now() - 20000000000 }],
  oldMealIds: [2, 3],
  app: { offline: true },
  login: true,
  load_history: page => (output = page),
  refresh: () => (output = 'refresh'),
}

describe('Dashboard', () => {
  test('should render all elements', () => {
    let tmp = window.addEventListener,
      tmp2 = window.removeEventListener

    window.addEventListener = (event, fn) => (output = { type: 'addListener', func: fn, event })
    window.removeEventListener = event => (output = { type: 'removeListener', event })
    const wrapper = shallow(<Dashboard {...options} />)

    expect(output.type).toBe('addListener')
    expect(output.event).toBe('focus')
    const triggerFocus = output.func
    triggerFocus()
    expect(output).toBe('refresh')

    expect(wrapper.find('.dashboard')).toHaveLength(1)
    expect(wrapper.find('.offlineBar')).toHaveLength(1)
    expect(wrapper.find('.filters')).toHaveLength(1)
    expect(wrapper.find(Pager)).toHaveLength(1)
    expect(wrapper.find(UserFrame)).toHaveLength(1)
    expect(wrapper.find('.filterList')).toHaveLength(1)
    expect(wrapper.find('.filterList > li')).toHaveLength(2)
    expect(wrapper.find(Meal)).toHaveLength(1)

    wrapper.setProps({ app: { offline: false }, login: false })
    wrapper
      .find('.filterList li')
      .at(1)
      .simulate('click')
    expect(wrapper.find(UserFrame)).toHaveLength(0)

    expect(wrapper.find('.offlineBar')).toHaveLength(0)
    expect(wrapper.find(Meal)).toHaveLength(2)
    expect(wrapper.find(Pager)).toHaveLength(1)

    const triggerHistory = wrapper.find(Pager).prop('onChange')

    triggerHistory({ page: 2 })
    expect(output).toEqual({ page: 2, size: 5 })

    output = false
    triggerFocus()
    expect(output).toBe(false)

    wrapper.unmount()
    expect(output.type).toBe('removeListener')
    expect(output.event).toBe('focus')
    window.addEventListener = tmp
    window.removeEventListener = tmp2
  })

  test('should trigger load_history on mount without old meals', () => {
    const wrapper = shallow(<Dashboard {...{ ...options, oldMealIds: [] }} />)
    wrapper
      .find('.filterList li')
      .at(1)
      .simulate('click')
    expect(output).toEqual({ page: 1, size: 5 })
  })
})
