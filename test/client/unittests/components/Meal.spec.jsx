import { mount, shallow } from 'enzyme'

import DateFinder from 'UI/DateFinder/DateFinder.jsx'
import Meal from 'UI/Meal/Meal.jsx'
import React from 'react'

function mergeById(arr1, arr2) {
  return arr1.map(option => Object.assign({}, option, arr2.find(opt => opt.id === option.id)))
}

function validateOptions(wrapper, mgOpt) {
  let diff = 0

  mgOpt.forEach((opt, index) => {
    if (opt.type !== 'toggle' || opt.show) {
      let elem = wrapper.find('.signupOptions > li').at(index - diff)

      switch (opt.type) {
        case 'count':
          expect(elem.find('.optionCount')).toHaveLength(1)
          expect(elem.find('.optionCount').text()).toContain(opt.count)
        case 'select':
          expect(elem.find('.optionValue')).toHaveLength(1)
          expect(elem.find('.optionValue').text()).toContain(opt.value)
          break
        case 'toggle':
          expect(elem.find('.optionShow')).toHaveLength(1)
          expect(elem.find('.optionShow').text()).toContain(opt.name)
          break
      }
    } else {
      diff++
    }
  })
}
let output

const actions = {
  start_edit_meal: () => (output = 'edit'),
  start_cancel_meal: () => (output = 'cancel'),
  start_edit_price: () => (output = 'edit_price'),
  start_meal_signup: () => (output = 'signup'),
  start_meal_edit: () => (output = 'signup_edit'),
  meal_cancel: () => (output = 'signup_cancel'),
  start_print: () => (output = 'start_print'),
}

const TU1 = {
    name: 'testuser',
    id: 0,
  },
  TU2 = {
    name: 'testuser2',
    id: 5,
  },
  TM = ({
    locked = 0,
    options = [],
    time = Date.now() + 20000000,
    deadline = Date.now() + 10000000,
    signups = [],
    signupLimit = 3,
    image,
    print = false,
    datefinder = 0,
  }) => ({
    id: 1,
    name: 'testmeal',
    creator: TU1.name,
    creatorId: TU1.id,
    image,
    description: 'testdescription',
    signupLimit,
    signups,
    deadline,
    time,
    options,
    locked,
    print,
    datefinder,
  }),
  TO = [
    {
      id: 1,
      name: 'Hackfleisch',
      type: 'select',
      price: 0,
      values: [
        {
          name: 'Rind',
          price: 5,
          id: 1,
        },
        {
          name: 'Schwein',
          price: 3,
          id: 2,
        },
      ],
    },
    {
      id: 2,
      name: 'Brötchen',
      type: 'count',
      price: 0,
      values: [
        {
          name: 'Doppel',
          price: 0,
          id: 3,
        },
        {
          name: 'Kürbiskern',
          price: 0,
          id: 4,
        },
      ],
    },
    {
      id: 3,
      name: 'Zwiebel',
      type: 'toggle',
      price: 0,
      values: [],
    },
  ],
  TS = ({ id = 1, name = 'testanon', comment = 'testcomment', meal = 1, paid = 0, price, userId, options = [] }) => ({
    id,
    name,
    comment,
    meal,
    paid,
    price,
    userId,
    options,
  }),
  TSO = ({ id = 1, value = null, count = null, show = null }) => ({
    id,
    value,
    count,
    show,
  })

describe('Meal', () => {
  test('should render all elements with correct input data', () => {
    const user = TU1,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.meal')).toHaveLength(1)
    expect(wrapper.find('.titlebar')).toHaveLength(1)
    expect(wrapper.find('.titlebar .name')).toHaveLength(1)
    expect(wrapper.find('.titlebar .name').text()).toContain(meal.name)
    expect(wrapper.find('.titlebar .menuIcon')).toHaveLength(3)
    expect(wrapper.find('.details')).toHaveLength(1)
    expect(wrapper.find('.mealImage')).toHaveLength(1)
    expect(wrapper.find('.mealImage').prop('src')).toBe(meal.image)
    expect(wrapper.find('.date')).toHaveLength(1)
    expect(wrapper.find('.creator')).toHaveLength(1)
    expect(wrapper.find('.description')).toHaveLength(1)
    expect(wrapper.find('.description').text()).toContain(meal.description)
    expect(wrapper.find('.participants')).toHaveLength(1)
    expect(wrapper.find('.participation')).toHaveLength(1)
    expect(wrapper.find('.count')).toHaveLength(1)
    expect(wrapper.find('.count').text()).toContain(meal.signups.length)
    expect(wrapper.find('.limit')).toHaveLength(1)
    expect(wrapper.find('.limit').text()).toContain(meal.signupLimit)
    expect(wrapper.find('.deadline')).toHaveLength(1)
    expect(wrapper.find('.participate')).toHaveLength(1)
    expect(wrapper.find('.participantsList')).toHaveLength(1)

    expect(signupElems).toHaveLength(2)

    signupElems.forEach((signup, index) => {
      expect(signup.find('.user .name')).toHaveLength(1)
      expect(signup.find('.money')).toHaveLength(1)
      expect(signup.find('.money').text()).toContain(signups[signupArray[index]].price)
      expect(signup.find('.icons')).toHaveLength(1)
      expect(signup.find('.icons > span')).toHaveLength(2)
      expect(signup.find('.comment')).toHaveLength(1)

      expect(signup.find('.signupOptions')).toHaveLength(1)
      expect(signup.find('.signupOptions > li')).toHaveLength(signups[signupArray[index]].options[2].show ? 3 : 2)
      validateOptions(signup, mergeById(signups[signupArray[index]].options, meal.options))
    })
  })

  test('should not show price when not locked, should not render signup link when full', () => {
    const user = TU1,
      signups = {
        1: TS({ id: 1, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 0, signups: signupArray, options: TO, signupLimit: 2 })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.participate')).toHaveLength(0)

    signupElems.forEach((signup, index) => {
      expect(signup.find('.money')).toHaveLength(0)
    })
  })

  test('should show datefinder title if datefinder active', () => {
    const user = TU1,
      meal = TM({ datefinder: 1 })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={[]} {...actions} />)

    expect(wrapper.find('.title').text()).toContain('Datumsumfrage für')
    expect(wrapper.find(DateFinder)).toHaveLength(1)
  })

  test('should not show edit options if past deadline', () => {
    const user = TU1,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO, deadline: Date.now() - 10000000 })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.participate')).toHaveLength(0)

    signupElems.forEach((signup, index) => {
      expect(signup.find('.icons')).toHaveLength(0)
      expect(signup.find('.icons > span')).toHaveLength(0)
    })
  })

  test('should not show edit options if not creator', () => {
    const user = TU2,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.participate')).toHaveLength(1)
    expect(wrapper.find('.titlebar .menuIcon')).toHaveLength(0)

    signupElems.forEach((signup, index) => {
      expect(signup.find('.icons')).toHaveLength(0)
      expect(signup.find('.icons > span')).toHaveLength(0)
    })
  })

  test('should not show edit options if not signup user', () => {
    const user = TU2,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, userId: 5, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.titlebar .menuIcon')).toHaveLength(0)

    expect(signupElems.at(0).find('.icons')).toHaveLength(0)
    expect(signupElems.at(0).find('.icons > span')).toHaveLength(0)

    expect(signupElems.at(1).find('.icons')).toHaveLength(1)
    expect(signupElems.at(1).find('.icons > span')).toHaveLength(2)
  })

  test('should not show signup link if full', () => {
    const user = TU2,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, userId: 5, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ locked: 1, signups: signupArray, signupLimit: 2, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    expect(wrapper.find('.participate')).toHaveLength(0)
  })

  test('should call addEventListener/removeEventlistener', () => {
    const user = TU2,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, userId: 5, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ locked: 1, signups: signupArray, signupLimit: 2, options: TO })

    let tmp = window.addEventListener,
      tmp2 = window.removeEventListener,
      output

    window.addEventListener = () => (output = 'addListener')
    window.removeEventListener = () => (output = 'removeListener')

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    expect(wrapper.find('.participate')).toHaveLength(0)
    expect(output).toBe('addListener')

    wrapper.unmount()
    expect(output).toBe('removeListener')
    window.addEventListener = tmp
    window.removeEventListener = tmp2
  })

  test('should only change props if editable or meal changes', () => {
    const user = TU2,
      signups = {},
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage2.jpg', locked: 1, signups: signupArray, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    wrapper.setProps({ meal: TM({ image: 'testimage.jpg', signups: signupArray, options: TO }) })
    wrapper.update()
    expect(wrapper.find('.mealImage').prop('src')).toBe('testimage.jpg')

    wrapper.setProps({ meal: TM({ image: 'testimage.jpg', signups: signupArray, options: TO, deadline: Date.now() - 10000000 }) })
    wrapper.update()

    const signupElems = wrapper.find('.participantsList > li')

    expect(wrapper.find('.participate')).toHaveLength(0)

    signupElems.forEach((signup, index) => {
      expect(signup.find('.icons')).toHaveLength(0)
      expect(signup.find('.icons > span')).toHaveLength(0)
    })

    wrapper.setState({ test: 'test' })
    wrapper.update()
  })

  test('should render nothing without meal props', () => {
    const user = TU2,
      signups = {},
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = undefined

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    expect(wrapper.find('.meal')).toHaveLength(0)
  })

  test('should add print class if print is true', () => {
    const user = TU2,
      signups = {},
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO, print: true })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    expect(wrapper.find('.meal.print')).toHaveLength(1)
  })

  test('should show no signupLimit if no signupLimit exists', () => {
    const user = TU2,
      signups = {},
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO, print: true, signupLimit: 0 })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} {...actions} />)

    expect(wrapper.find('.meal .limit')).toHaveLength(0)
  })

  test('actions should be called', () => {
    const user = TU1,
      signups = {
        1: TS({ id: 1, price: 3, options: [TSO({ id: 1, value: 'Schwein' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 1 })] }),
        2: TS({ id: 2, userId: 5, price: 5, options: [TSO({ id: 1, value: 'Rind' }), TSO({ id: 2, value: 'Kürbiskern', count: 2 }), TSO({ id: 3, show: 0 })] }),
      },
      signupArray = Object.values(signups).map(signup => signup.id),
      meal = TM({ image: 'testimage.jpg', locked: 1, signups: signupArray, options: TO })

    const wrapper = shallow(<Meal meal={meal} user={user} signups={signups} showPrint={true} {...actions} />),
      signupElems = wrapper.find('.participantsList > li')

    wrapper
      .find('.titlebar .menuIcon')
      .at(0)
      .simulate('click')
    expect(output).toBe('start_print')
    wrapper
      .find('.titlebar .menuIcon')
      .at(1)
      .simulate('click')
    expect(output).toBe('edit_price')
    wrapper
      .find('.titlebar .menuIcon')
      .at(2)
      .simulate('click')
    expect(output).toBe('edit')
    wrapper
      .find('.titlebar .menuIcon')
      .at(3)
      .simulate('click')
    expect(output).toBe('cancel')
    signupElems
      .at(0)
      .find('.icons > span')
      .at(0)
      .simulate('click')
    expect(output).toBe('signup_edit')
    signupElems
      .at(0)
      .find('.icons > span')
      .at(1)
      .simulate('click')
    expect(output).toBe('signup_cancel')
    signupElems
      .at(1)
      .find('.icons > span')
      .at(0)
      .simulate('click')
    expect(output).toBe('signup_edit')
    signupElems
      .at(1)
      .find('.icons > span')
      .at(1)
      .simulate('click')
    expect(output).toBe('signup_cancel')
    wrapper.find('.participate').simulate('click')
    expect(output).toBe('signup')
  })
})
