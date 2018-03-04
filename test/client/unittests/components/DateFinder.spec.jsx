import React from 'react';
import { shallow, mount } from 'enzyme';
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker.jsx';
import DateFinder from 'UI/DateFinder/DateFinder.jsx';
import { handleWheel } from 'UI/DateFinder/DateFinder.jsx';
import { formatDate, formatTime, round } from 'UTILS/date.js'

let output

const datefinderObj = {
  "id": 1,
  "creator": 1,
  "deadline": Date.now() + 1000000,
  "participants": [
    {
      "user": 1,
      "name": "test1234"
    },
    {
      "user": 3,
      "name": "test1234"
    }
  ],
  "dates": [
    {
      "id": 1,
      "time": Date.now() + 2000000,
      "users": [
        {
          "user": 3,
          "name": "test1234"
        }
      ]
    },
    {
      "id": 2,
      "time": Date.now() + 5000000,
      "users": [

      ]
    },
    {
      "id": 3,
      "time": Date.now() + 4000000,
      "users": [
        {
          "user": 1,
          "name": "test1234"
        },
        {
          "user": 3,
          "name": "test1234"
        }
      ]
    }
  ]
}

const renderDatefinder = ({
  user = { id: 1 },
  edit = false,
  datefinder = datefinderObj,
  actions = {
    datefinderStartDeleteDate: (...data) => output = { data, type: 'startDelete' },
    datefinderStartAddDate: (data) => output = { data, type: 'startAdd' },
    datefinderSetDeadline: (data) => output = { data, type: 'setDead' },
    datefinderFinalize: (...data) => output = { data, type: 'final' },
    datefinderToggleDate: (data) => output = { data, type: 'toggle' },
  }
}) => {
  const wrapper = shallow(<DateFinder user={user} edit={edit} datefinder={datefinder} {...actions} />);


  return { wrapper }
}


describe('DateFinder', () => {
  test('should render the complete element with correct data for non-admin participating user', () => {
    const { wrapper } = renderDatefinder({ user: { id: 3 } })

    expect(wrapper.find('.datesListWrapper')).toHaveLength(1);
    expect(wrapper.find('.finalize.start')).toHaveLength(0);
    expect(wrapper.find('.finalize.cancel')).toHaveLength(0);

    expect(wrapper.find('.deadline')).toHaveLength(1);
    expect(wrapper.find('.deadlineDatefinder')).toHaveLength(0);
    expect(wrapper.find(DayTimePicker)).toHaveLength(0);
    expect(wrapper.find('.participantsList')).toHaveLength(1);
    expect(wrapper.find('.participantsList li')).toHaveLength(2);
    expect(wrapper.find('.participantsList .myself')).toHaveLength(1);

    expect(wrapper.find('.datesList')).toHaveLength(1);
    expect(wrapper.find('.datesList li')).toHaveLength(3);
    expect(wrapper.find('.datesList li').at(0).hasClass('selected')).toBe(true);
    expect(wrapper.find('.datesList li').at(1).hasClass('selected')).toBe(true);
    expect(wrapper.find('.datesList li').at(2).hasClass('selected')).toBe(false);
  });

  test('should render the complete element with correct data for non-admin non-participating user', () => {
    const { wrapper } = renderDatefinder({ user: { id: 2 } })

    expect(wrapper.find('.datesListWrapper')).toHaveLength(1);
    expect(wrapper.find('.finalize.start')).toHaveLength(0);
    expect(wrapper.find('.finalize.cancel')).toHaveLength(0);

    expect(wrapper.find('.deadline')).toHaveLength(1);
    expect(wrapper.find('.deadlineDatefinder')).toHaveLength(0);
    expect(wrapper.find(DayTimePicker)).toHaveLength(0);
    expect(wrapper.find('.participantsList')).toHaveLength(1);
    expect(wrapper.find('.participantsList li')).toHaveLength(2);
    expect(wrapper.find('.participantsList .myself')).toHaveLength(0);

    expect(wrapper.find('.datesList')).toHaveLength(1);
    expect(wrapper.find('.datesList li')).toHaveLength(3);
    expect(wrapper.find('.datesList .addDateWrapper')).toHaveLength(0);
    expect(wrapper.find('.datesList li').at(0).hasClass('selected')).toBe(false);
    expect(wrapper.find('.datesList li').at(1).hasClass('selected')).toBe(false);
    expect(wrapper.find('.datesList li').at(2).hasClass('selected')).toBe(false);
  });

  test('should render the complete element with correct data for admin participating user', () => {
    const { wrapper } = renderDatefinder({ user: { id: 1 }, edit: true })

    expect(wrapper.find('.datesListWrapper')).toHaveLength(1);
    expect(wrapper.find('.finalize.start')).toHaveLength(1);
    expect(wrapper.find('.finalize.cancel')).toHaveLength(0);

    expect(wrapper.find('.deadline')).toHaveLength(1);
    expect(wrapper.find('.deadline .fa-pencil')).toHaveLength(1);
    expect(wrapper.find('.deadlineDatefinder')).toHaveLength(0);
    expect(wrapper.find(DayTimePicker)).toHaveLength(0)
    expect(wrapper.find('.participantsList')).toHaveLength(1);
    expect(wrapper.find('.participantsList li')).toHaveLength(2);
    expect(wrapper.find('.participantsList .myself')).toHaveLength(1);

    expect(wrapper.find('.datesList')).toHaveLength(1);
    expect(wrapper.find('.datesList .addDateWrapper')).toHaveLength(1);
    expect(wrapper.find('.datesList li')).toHaveLength(4);
    expect(wrapper.find('.datesList li .deleteIcon')).toHaveLength(3);
    expect(wrapper.find('.datesList li').at(1).hasClass('selected')).toBe(false);
    expect(wrapper.find('.datesList li').at(2).hasClass('selected')).toBe(true);
    expect(wrapper.find('.datesList li').at(3).hasClass('selected')).toBe(false);
  });

  test('should allow admin to edit the deadline add or delete dates', () => {
    const { wrapper } = renderDatefinder({ user: { id: 1 }, edit: true })

    expect(wrapper.find('.deadline')).toHaveLength(1);
    wrapper.find('.deadline .fa-pencil').simulate('click')

    expect(wrapper.find('.deadline')).toHaveLength(0);
    expect(wrapper.find('.deadlineDatefinder')).toHaveLength(1);
    expect(wrapper.find(DayTimePicker)).toHaveLength(1);

    const date = new Date(Date.now() + 1231231)

    wrapper.find(DayTimePicker).prop('onSubmit')(date)
    expect(output.data.deadline).toEqual(date.getTime())
    expect(output.data.datefinder).toEqual(datefinderObj.id)
    expect(output.type).toEqual('setDead')

    wrapper.find('.addDateWrapper').simulate('click')
    expect(output.data).toEqual(datefinderObj.id)
    expect(output.type).toEqual('startAdd')

    wrapper.find('.datesList li .deleteIcon').at(2).simulate('click')
    expect(output.data).toEqual([datefinderObj.id, datefinderObj.dates[2].id])
    expect(output.type).toEqual('startDelete')
  });

  test('should allow admin to toggle dates if signup Icon is not in classlists', () => {
    const { wrapper } = renderDatefinder({ user: { id: 1 }, edit: true })

    const evtTarg = (contains) => ({
      target: {
        classList: (contains ? ['signupIcon'] : []),
        parentElement: {
          classList: [],
          parentElement: {
            classList: []
          }
        }
      }
    })

    output = false

    wrapper.find('.datesList li > div').at(2).simulate('click', evtTarg(true))
    expect(output).toEqual(false)
    wrapper.find('.datesList li > div').at(2).simulate('click', evtTarg(false))
    expect(output.type).toEqual('toggle')
    expect(output.data).toEqual({ "date": 2, "selected": false, "user": { "id": 1 } })

    wrapper.find('.datesList li > div').at(1).simulate('click', evtTarg(false))
    expect(output.type).toEqual('toggle')
    expect(output.data).toEqual({ "date": 3, "selected": true, "user": { "id": 1 } })
  });

  test('should allow admin to lock the datefinder and select a date', () => {
    const { wrapper } = renderDatefinder({ user: { id: 1 }, edit: true })

    wrapper.find('.finalize').simulate('click')

    expect(wrapper.find('.finalize')).toHaveLength(2);
    expect(wrapper.find('.finalizeList')).toHaveLength(1);
    expect(wrapper.find('.finalize.cancel')).toHaveLength(1);
    expect(wrapper.find('.finalize.complete')).toHaveLength(1);
    expect(wrapper.find('.finalizeList > li')).toHaveLength(3);
    expect(wrapper.find('.finalizeList > li.selected')).toHaveLength(0);
    expect(wrapper.find('.datesListWrapper')).toHaveLength(0);
    expect(wrapper.find('.finalizeList > li').at(0).find('.participantsList > li')).toHaveLength(2);
    expect(wrapper.find('.finalizeList > li').at(1).find('.participantsList > li')).toHaveLength(1);
    expect(wrapper.find('.finalizeList > li').at(2).find('.participantsList > li')).toHaveLength(0);


    wrapper.find('.finalizeList > li').at(2).simulate('click')
    expect(wrapper.find('.finalizeList > li.selected')).toHaveLength(1);

    wrapper.find('.finalizeList > li').at(2).simulate('click')
    expect(wrapper.find('.finalizeList > li.selected')).toHaveLength(0);

    wrapper.find('.finalizeList > li').at(2).simulate('click')
    expect(wrapper.find('.finalizeList > li.selected')).toHaveLength(1);

    wrapper.find('.finalizeList > li').at(0).simulate('click')
    expect(wrapper.find('.finalizeList > li.selected')).toHaveLength(1);

    wrapper.find('.finalize.complete').simulate('click')
    expect(output.data).toEqual([datefinderObj.id, 3])
    expect(output.type).toEqual('final')

    wrapper.find('.finalize.cancel').simulate('click')

    expect(wrapper.find('.finalize')).toHaveLength(1);
    expect(wrapper.find('.finalize.start')).toHaveLength(1);
    expect(wrapper.find('.finalizeList')).toHaveLength(0);
    expect(wrapper.find('.datesListWrapper')).toHaveLength(1);
  });

  test('should render nothing without datefinder prop', () => {
    const wrapper = shallow(<DateFinder />)

    expect(wrapper.find('.datesListWrapper')).toHaveLength(0);
    expect(wrapper.find('.finalize')).toHaveLength(0);
    expect(wrapper.find('.datefinder')).toHaveLength(0);
  });

  test('should render user list when clicked', () => {
    const { wrapper } = renderDatefinder({})

    wrapper.find('.datesList li').at(1).find('.signupIcon').at(0).simulate('click')
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper')).toHaveLength(1)
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper li')).toHaveLength(2)

    wrapper.find('.datesList li').at(1).find('.signupIcon').at(0).simulate('click')
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper')).toHaveLength(0)
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper li')).toHaveLength(0)
    wrapper.find('.datesList li').at(1).find('.signupIcon').at(0).simulate('click')

    wrapper.find('.datesList li').at(0).find('.signupIcon').at(0).simulate('click')
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper')).toHaveLength(0)
    expect(wrapper.find('.datesList li').at(1).find('.userListWrapper li')).toHaveLength(0)
    expect(wrapper.find('.datesList li').at(0).find('.userListWrapper')).toHaveLength(1)
    expect(wrapper.find('.datesList li').at(0).find('.userListWrapper li')).toHaveLength(1)
  });

  describe('handleWheel', () => {
    test('should scroll propely', () => {
      let evt1 = {
        deltaY: 10,
        currentTarget: {
          scrollWidth: 100,
          offsetWidth: 20,
          scrollLeft: 10,
        },
        preventDefault: () => null,
        stopPropagation: () => null
      },
        evt2 = {
          deltaY: 10,
          currentTarget: {
            scrollWidth: 100,
            offsetWidth: 100,
            scrollLeft: 0,
          },
          preventDefault: () => null,
          stopPropagation: () => null
        },
        evt3 = {
          deltaY: -10,
          currentTarget: {
            scrollWidth: 100,
            offsetWidth: 20,
            scrollLeft: 0,
          },
          preventDefault: () => null,
          stopPropagation: () => null
        },
        evt4 = {
          deltaY: -10,
          currentTarget: {
            scrollWidth: 100,
            offsetWidth: 20,
            scrollLeft: 20,
          },
          preventDefault: () => null,
          stopPropagation: () => null
        }

      handleWheel(evt1)
      handleWheel(evt2)
      handleWheel(evt3)
      handleWheel(evt4)

      expect(evt1).toMatchObject({
        deltaY: 10,
        currentTarget: {
          scrollWidth: 100,
          offsetWidth: 20,
          scrollLeft: 20,
        },
      })

      expect(evt2).toMatchObject({
        deltaY: 10,
        currentTarget: {
          scrollWidth: 100,
          offsetWidth: 100,
          scrollLeft: 0,
        },
      })

      expect(evt3).toMatchObject({
        deltaY: -10,
        currentTarget: {
          scrollWidth: 100,
          offsetWidth: 20,
          scrollLeft: 0,
        },
      })

      expect(evt4).toMatchObject({
        deltaY: -10,
        currentTarget: {
          scrollWidth: 100,
          offsetWidth: 20,
          scrollLeft: 10,
        },
      })
    })
  })

});



