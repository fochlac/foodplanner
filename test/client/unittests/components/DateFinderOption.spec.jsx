import { formatDate, formatTime, round } from 'UTILS/date.js'
import { mount, shallow } from 'enzyme'

import DateFinderOption from 'UI/CreateMealDialog/DateFinderOption.jsx'
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker.jsx'
import React from 'react'

let output

const datefinderObj = {
  id: 1,
  creator: 1,
  deadline: Date.now() + 1000000,
  participants: [
    {
      user: 1,
      name: 'test1234',
    },
    {
      user: 3,
      name: 'test1234',
    },
  ],
  dates: [
    {
      id: 1,
      time: Date.now() + 2000000,
      users: [
        {
          user: 3,
          name: 'test1234',
        },
      ],
    },
    {
      id: 2,
      time: Date.now() + 5000000,
      users: [],
    },
    {
      id: 3,
      time: Date.now() + 4000000,
      users: [
        {
          user: 1,
          name: 'test1234',
        },
        {
          user: 3,
          name: 'test1234',
        },
      ],
    },
  ],
}

const renderDateFinderOption = ({ user = { id: 1 }, edit = true, datefinder = datefinderObj }) => {
  const wrapper = shallow(<DateFinderOption editable={edit} datefinder={datefinder} onChange={data => (output = data)} />)

  return { wrapper }
}

describe('DateFinder', () => {
  test('should render the complete element with correct data', () => {
    const { wrapper } = renderDateFinderOption({})

    expect(wrapper.find('.datefinderOption')).toHaveLength(1)

    expect(wrapper.find('.deadline')).toHaveLength(1)
    expect(wrapper.find('.addValue')).toHaveLength(1)
    expect(wrapper.find(DayTimePicker)).toHaveLength(2)

    expect(wrapper.find('.valueCloud')).toHaveLength(1)
    expect(wrapper.find('.valueCloud li')).toHaveLength(3)
    expect(wrapper.find('.valueCloud li .fa-times')).toHaveLength(3)
  })

  test('should render the complete element with correct data with edit false', () => {
    const { wrapper } = renderDateFinderOption({ edit: false })

    expect(wrapper.find('.datefinderOption')).toHaveLength(1)

    expect(wrapper.find('.deadline')).toHaveLength(1)
    expect(wrapper.find('.addValue')).toHaveLength(0)
    expect(wrapper.find(DayTimePicker)).toHaveLength(1)

    expect(wrapper.find('.valueCloud')).toHaveLength(1)
    expect(wrapper.find('.valueCloud li')).toHaveLength(3)
    expect(wrapper.find('.valueCloud li .fa-times')).toHaveLength(0)
  })

  test('should render the complete element without data', () => {
    const wrapper = shallow(<DateFinderOption editable={true} onChange={data => (output = data)} />)

    expect(wrapper.find('.datefinderOption')).toHaveLength(1)

    expect(wrapper.find('.deadline')).toHaveLength(1)
    expect(wrapper.find('.addValue')).toHaveLength(1)
    expect(wrapper.find(DayTimePicker)).toHaveLength(2)

    expect(wrapper.find('.valueCloud')).toHaveLength(1)
    expect(wrapper.find('.valueCloud li')).toHaveLength(0)
  })

  test('should delete date on click', () => {
    const { wrapper } = renderDateFinderOption({})

    expect(wrapper.find('.datefinderOption')).toHaveLength(1)

    expect(wrapper.find('.valueCloud li')).toHaveLength(3)

    wrapper
      .find('.valueCloud li .fa-times')
      .at(0)
      .simulate('click')
    expect(wrapper.find('.valueCloud li')).toHaveLength(2)

    expect(output).toMatchObject({
      deadline: round(datefinderObj.deadline, 30 * 60).getTime(),
      dates: [datefinderObj.dates[1], datefinderObj.dates[2]],
    })
  })

  test('should add date on click', () => {
    const { wrapper } = renderDateFinderOption({})
    const date = new Date()

    wrapper
      .find(DayTimePicker)
      .at(1)
      .prop('onChange')(date)

    wrapper
      .find('.addButton')
      .at(0)
      .simulate('click')

    expect(wrapper.find('.valueCloud li')).toHaveLength(4)
    expect(output).toMatchObject({
      deadline: round(datefinderObj.deadline, 30 * 60).getTime(),
      dates: [datefinderObj.dates[0], datefinderObj.dates[1], datefinderObj.dates[2], { time: round(date, 30 * 60).getTime() }],
    })

    wrapper
      .find(DayTimePicker)
      .at(1)
      .prop('onChange')(date)

    wrapper
      .find('.addButton')
      .at(0)
      .simulate('click')

    expect(wrapper.find('.valueCloud li')).toHaveLength(4)
  })

  test('should set deadline ', () => {
    const { wrapper } = renderDateFinderOption({})
    const date = new Date()

    wrapper
      .find(DayTimePicker)
      .at(0)
      .prop('onChange')(date)

    expect(output).toMatchObject({
      deadline: round(date, 30 * 60).getTime(),
      dates: [datefinderObj.dates[0], datefinderObj.dates[1], datefinderObj.dates[2]],
    })
  })
})
