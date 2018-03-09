import { formatDate, formatTime, round } from 'UTILS/date.js'
import { mount, shallow } from 'enzyme'

import CreateMealDialog from 'UI/CreateMealDialog/CreateMealDialog.jsx'
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker.jsx'
import Dialog from 'UI/Dialog.js'
import ImageUploader from 'UI/ImageUploader/ImageUploader.jsx'
import MealOption from 'UI/CreateMealDialog/MealOption.jsx'
import React from 'react'

describe('CreateMealDialog', () => {
  test('should render all elements', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS} />)

    expect(wrapper.find('.titlebar').length).toBe(1)
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1)
    expect(wrapper.find('.body').length).toBe(1)
    expect(wrapper.find('.foot').length).toBe(1)
    expect(wrapper.find('.foot button').length).toBe(2)

    expect(wrapper.find(Dialog)).toHaveLength(1)
    expect(wrapper.find(ImageUploader)).toHaveLength(1)
    expect(wrapper.find(DayTimePicker)).toHaveLength(2)

    expect(wrapper.find('#CreateMealDialog_name')).toHaveLength(1)
    expect(wrapper.find('#CreateMealDialog_description')).toHaveLength(1)
    expect(wrapper.find('#CreateMealDialog_signupLimit')).toHaveLength(1)
    expect(wrapper.find('.addOption')).toHaveLength(1)
  })

  test('should render meal options on add option link click', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS} />)
    wrapper.find('.addOption').simulate('click')

    expect(wrapper.find(MealOption)).toHaveLength(1)
  })

  test('should display templates and render them on selection', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [{ options: ['', ''], name: 'test', id: 0 }, { options: ['', '', '', ''], name: 'test2', id: 1 }],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS} />)

    expect(wrapper.find('.templateSelector')).toHaveLength(1)
    expect(wrapper.find('.templateSelector option')).toHaveLength(3)
    expect(
      wrapper
        .find('.templateSelector option')
        .at(1)
        .prop('value'),
    ).toBe(0)
    expect(
      wrapper
        .find('.templateSelector option')
        .last()
        .prop('value'),
    ).toBe(1)

    wrapper.find('.templateSelector').simulate('change', { target: { value: 0 } })

    expect(wrapper.find(MealOption)).toHaveLength(2)
  })

  test('should close on cancel button click', () => {
    let dialog_closed = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} close_dialog={() => (dialog_closed = true)} />)

    wrapper.find('button.cancel').simulate('click')

    expect(dialog_closed).toBe(true)
  })

  test('should render invalid text when invalid', () => {
    let dialog_closed = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      wrapper = shallow(
        <CreateMealDialog user={TEST_USER} invalid={true} app={TEST_APP} meals={TEST_MEALS} meal={{}} close_dialog={() => (dialog_closed = true)} />,
      )

    expect(wrapper.find('.addOption')).toHaveLength(0)
    expect(wrapper.find('.body p')).toHaveLength(1)
  })

  test('should close on close button click', () => {
    let dialog_closed = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} close_dialog={() => (dialog_closed = true)} />)

    wrapper.find('.titlebar span.fa-times').simulate('click')

    expect(dialog_closed).toBe(true)
  })

  test('should properly restore state', () => {
    let create_meal = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = {
        dialog: {
          state: {
            time: new Date(),
            deadline: new Date(),
            options: [],
            name: 'test',
          },
        },
      },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} create_meal={output => (create_meal = output)} />)

    wrapper.find('button.submit').simulate('click')

    expect(create_meal.get()).toMatchObject({
      name: 'test',
    })
  })

  test('should properly set image data', () => {
    let create_meal = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = {
        dialog: {
          state: {
            time: new Date(),
            deadline: new Date(),
            options: [],
            name: 'test',
          },
        },
      },
      TEST_MEALS = [],
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} create_meal={output => (create_meal = output)} />)

    wrapper.find(ImageUploader).prop('callback')('test123')

    wrapper.find('button.submit').simulate('click')
    expect(create_meal.get()).toMatchObject({
      imageData: 'test123',
    })
  })

  test('should output correct data on submit button click', () => {
    let create_meal = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      TEST_MEAL = {
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        image: '',
        datefinder: '{}',
        description: 'testdescription',
        signupLimit: 3,
        deadline: Date.now() + 1000000000,
        time: Date.now() + 2000000000,
        options: JSON.stringify([]),
      },
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} create_meal={output => (create_meal = output)} />)

    history.pushState({}, 'test', '/termin')
    wrapper.find('#CreateMealDialog_name').simulate('change', { target: { value: TEST_MEAL.name } })
    wrapper.find('#CreateMealDialog_description').simulate('change', { target: { value: TEST_MEAL.description } })
    wrapper.find('#CreateMealDialog_signupLimit').simulate('change', { target: { value: TEST_MEAL.signupLimit } })

    const changeDead = wrapper
      .find(DayTimePicker)
      .at(0)
      .prop('onChange')
    const changeTime = wrapper
      .find(DayTimePicker)
      .at(1)
      .prop('onChange')

    changeDead(new Date(TEST_MEAL.deadline))
    wrapper.update()
    expect(wrapper.find(DayTimePicker).at(1).prop('time')).toEqual(new Date(TEST_MEAL.deadline))
    changeTime(new Date(TEST_MEAL.time))

    wrapper.find('button.submit').simulate('click')

    expect(create_meal.get()).toEqual(TEST_MEAL)
  })

  test('should delete and set options', () => {
    let create_meal = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      TEST_MEAL = {
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        datefinder: '{}',
        image: '',
        description: 'testdescription',
        signupLimit: 3,
        deadline: Date.now() + 10000000,
        time: Date.now() + 20000000,
        options: [],
        signups: [],
      },
      wrapper = shallow(
        <CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={TEST_MEAL} edit={true} edit_meal={(id, output) => (create_meal = output)} />,
      )

    wrapper.find('.addOption').simulate('click')

    expect(wrapper.find(MealOption)).toHaveLength(1)
    wrapper.find(MealOption).prop('deleteOption')()
    wrapper.update()

    expect(wrapper.find(MealOption)).toHaveLength(0)

    wrapper.find('.addOption').simulate('click')
    expect(wrapper.find(MealOption)).toHaveLength(1)
    wrapper.find(MealOption).prop('setOption')({ test: 'test' })

    wrapper.find('button.submit').simulate('click')

    TEST_MEAL.options = JSON.stringify([{ test: 'test' }])
    delete TEST_MEAL.signups
    expect(create_meal.get()).toEqual(TEST_MEAL)
  })

  test('should output correct data on submit button click', () => {
    let create_meal = false

    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      TEST_MEAL = {
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        datefinder: '{}',
        image: '',
        description: 'testdescription',
        signupLimit: 3,
        deadline: Date.now() + 10000000,
        time: Date.now() + 20000000,
        options: [],
        signups: [],
      },
      wrapper = shallow(
        <CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={TEST_MEAL} edit={true} edit_meal={(id, output) => (create_meal = output)} />,
      )

    wrapper.find('button.submit').simulate('click')

    TEST_MEAL.options = JSON.stringify(TEST_MEAL.options)
    delete TEST_MEAL.signups
    expect(create_meal.get()).toEqual(TEST_MEAL)
  })

  test('should render all elements with preset values', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [],
      TEST_MEAL = {
        id: 1,
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        image: '',
        description: 'testdescription',
        signupLimit: 3,
        signups: [],
        deadline: Date.now() + 10000000,
        time: Date.now() + 20000000,
        options: [{}, {}],
      },
      deadline = new Date(TEST_MEAL.deadline),
      time = new Date(TEST_MEAL.time),
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS} />)

    expect(wrapper.find(MealOption)).toHaveLength(2)

    expect(wrapper.find('#CreateMealDialog_name').prop('defaultValue')).toBe(TEST_MEAL.name)
    expect(wrapper.find('#CreateMealDialog_description').prop('defaultValue')).toBe(TEST_MEAL.description)
    expect(wrapper.find('#CreateMealDialog_signupLimit').prop('defaultValue')).toBe(TEST_MEAL.signupLimit)
    expect(wrapper.find('.templateSelector')).toHaveLength(0)
    expect(wrapper.find('.addOption')).toHaveLength(1)
  })

  test('should render add option and template selector with preset values without options', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [{ options: ['', ''], name: 'test', id: 0 }, { options: ['', '', '', ''], name: 'test2', id: 1 }],
      TEST_MEAL = {
        id: 1,
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        image: '',
        description: 'testdescription',
        signupLimit: 3,
        signups: [],
        deadline: Date.now() + 10000000,
        time: Date.now() + 20000000,
        options: [],
      },
      deadline = new Date(TEST_MEAL.deadline),
      time = new Date(TEST_MEAL.time),
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS} />)

    expect(wrapper.find('.addOption')).toHaveLength(1)
    expect(wrapper.find('.templateSelector')).toHaveLength(1)
  })

  test('should not render add option and template selector with preset values without options with signups', () => {
    const TEST_USER = { id: 1, name: 'test' },
      TEST_APP = { dialog: {} },
      TEST_MEALS = [{ options: ['', ''], name: 'test', id: 0 }, { options: ['', '', '', ''], name: 'test2', id: 1 }],
      TEST_MEAL = {
        id: 1,
        name: 'testmeal',
        creator: TEST_USER.name,
        creatorId: TEST_USER.id,
        image: '',
        description: 'testdescription',
        signupLimit: 3,
        signups: [{}],
        deadline: Date.now() + 10000000,
        time: Date.now() + 20000000,
        options: [],
      },
      deadline = new Date(TEST_MEAL.deadline),
      time = new Date(TEST_MEAL.time),
      wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS} />)

    expect(wrapper.find('.addOption')).toHaveLength(0)
    expect(wrapper.find('.templateSelector')).toHaveLength(0)
  })
})
