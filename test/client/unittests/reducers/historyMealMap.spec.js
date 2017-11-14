import historyMealMap from 'STORE/reducers/historyMealMap.js'

describe('historyMealMap-reducer', () => {

  test('LOAD_HISTORY', () => {
    const action = {
      type: 'LOAD_HISTORY',
      status: 'complete',
      data: {
        meals: [{ id: 2 }, { id: 5 }, { id: 8 }]
      },
      page: 2,
      size: 2,
    }

    expect(historyMealMap([], action)).toEqual({ 2: 2, 3: 5, 4: 8 })

    action.page = 1

    expect(historyMealMap([], action)).toEqual({ 0: 2, 1: 5, 2: 8 })

    action.page = 2
    action.size = 3

    expect(historyMealMap({ 0: 3, 3: 7 }, action)).toEqual({ 0: 3, 3: 2, 4: 5, 5: 8 })


    action.status = false

    expect(
      historyMealMap(
        {
          test: '123',
          errors: {
            1: 'asd',
          },
        },
        action,
      ),
    ).toEqual({
      test: '123',
      errors: {
        1: 'asd',
      },
    })
  })

  test('REFRESH', () => {
    const action = {
      type: 'REFRESH',
      status: 'complete',
      data: {}
    }

    expect(
      historyMealMap(
        {
          test: '123',
          errors: {
            1: 'asd',
          },
        },
        action,
      ),
    ).toEqual({
      test: '123',
      errors: {
        1: 'asd',
      },
    })

    action.data.meals = {}

    expect(
      historyMealMap(
        {
          test: '123',
          errors: {
            1: 'asd',
          },
        },
        action,
      ),
    ).toEqual({})
  })

  test('default', () => {
    const action = {
      type: 'asdawd',
      status: 'complete',
      id: 1,
    }

    expect(
      historyMealMap(
        {
          1: '12312534',
          2: '12312534',
          3: '12312534',
        },
        action,
      ),
    ).toEqual({
      1: '12312534',
      2: '12312534',
      3: '12312534',
    })
  })
})
