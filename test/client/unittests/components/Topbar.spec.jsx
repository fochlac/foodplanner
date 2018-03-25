import { mount, shallow } from 'enzyme'

import React from 'react'
import Topbar from 'UI/Topbar/Topbar.jsx'

let output

const actions = {
  create_settings_dialog: () => (output = 'create_settings_dialog'),
  create_meal_dialog: () => (output = 'create_meal_dialog'),
  sign_out: () => (output = 'sign_out'),
  start_sign_in: () => (output = 'start_sign_in'),
  instance: {
    title: 'test',
    icon: 'testicon',
    root: 'test123',
  },
}

describe('Topbar', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<Topbar user={{ id: 1 }} app={{ hiddenBusy: true, busyList: ['test2', 'refresh', 'test'], dialog: '' }} {...actions} />)

    expect(wrapper.find('.topbar')).toHaveLength(1)
    expect(wrapper.find('h3')).toHaveLength(1)
    expect(wrapper.find('h3').text()).toEqual('test')
    expect(wrapper.find('.testicon')).toHaveLength(1)
    expect(wrapper.find('.quicklinks')).toHaveLength(1)
    expect(wrapper.find('.quicklinks > li')).toHaveLength(4)
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(1)
    expect(wrapper.find('.quicklinks .fa-cog')).toHaveLength(1)
    expect(wrapper.find('.quicklinks .fa-plus')).toHaveLength(1)
    expect(wrapper.find('.quicklinks .fa-sign-out')).toHaveLength(1)
  })

  test('should not render busy if not busy', () => {
    const wrapper = shallow(<Topbar user={{ id: 1 }} app={{ hiddenBusy: false, dialog: '' }} {...actions} />)

    expect(wrapper.find('.quicklinks > li')).toHaveLength(3)
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(0)
  })

  test('should not render busy if busy but not with refresh', () => {
    const wrapper = shallow(<Topbar user={{ id: 1 }} app={{ hiddenBusy: true, busyList: ['test2', 'reasdwfresh', 'test'], dialog: '' }} {...actions} />)

    expect(wrapper.find('.quicklinks > li')).toHaveLength(3)
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(0)
  })

  test('should render settings and signin when not signed in', () => {
    const wrapper = shallow(<Topbar user={{}} app={{ hiddenBusy: false, dialog: '' }} {...actions} />)

    expect(wrapper.find('.topbar')).toHaveLength(1)
    expect(wrapper.find('h3')).toHaveLength(1)
    expect(wrapper.find('.quicklinks')).toHaveLength(1)
    expect(wrapper.find('.quicklinks > li')).toHaveLength(2)
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(0)
    expect(wrapper.find('.quicklinks .fa-cog')).toHaveLength(1)
    expect(wrapper.find('.quicklinks .fa-plus')).toHaveLength(0)
    expect(wrapper.find('.quicklinks .fa-sign-out')).toHaveLength(0)
    expect(wrapper.find('.quicklinks .fa-sign-in')).toHaveLength(1)
  })

  test('should call correct actions', () => {
    const wrapper = shallow(<Topbar user={{ id: 1 }} app={{ hiddenBusy: false, dialog: '' }} {...actions} />)
    const quicklinks = wrapper.find('.quicklinks')

    quicklinks.childAt(0).simulate('click')
    expect(output).toBe('create_settings_dialog')
    quicklinks.childAt(1).simulate('click')
    expect(output).toBe('create_meal_dialog')
    quicklinks.childAt(2).simulate('click')
    expect(output).toBe('sign_out')
  })

  test('should call correct actions', () => {
    const wrapper = shallow(<Topbar user={{}} app={{ hiddenBusy: false, dialog: '' }} {...actions} />)
    const quicklinks = wrapper.find('.quicklinks')

    quicklinks.childAt(0).simulate('click')
    expect(output).toBe('create_settings_dialog')
    quicklinks.childAt(1).simulate('click')
    expect(output).toBe('start_sign_in')
  })

  test('should call correct actions', done => {
    window.location.assign = url => {
      expect(url).toBe('test123')
      done()
    }

    const wrapper = shallow(<Topbar user={{ id: 1 }} app={{ hiddenBusy: false, dialog: '' }} {...actions} />)
    const reload = wrapper.find('.pointer')

    reload.simulate('click')
  })
})
