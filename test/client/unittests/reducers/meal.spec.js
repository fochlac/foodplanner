import meal from 'STORE/reducers/meals.js'

describe('meal-reducer', () => {
  test('MEAL_SIGNUP', () => {
    const action = {
      type: 'MEAL_SIGNUP',
      status: 'complete',
      data: {
        meal: 1,
        id: 'test',
      },
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3, 'test'],
      },
      {
        id: 2,
        signups: [1, 2, 3],
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('DIALOG-PRINT_MEAL', () => {
    const action = {
      type: 'DIALOG',
      content: 'PRINT_MEAL',
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
            print: true,
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
        print: false,
      },
      {
        id: 2,
        signups: [1, 2, 3],
        print: false,
      },
    ])

    action.content = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('PRINT_MEAL', () => {
    const action = {
      type: 'PRINT_MEAL',
      ids: [1, 3],
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
            print: false,
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
        print: true,
      },
      {
        id: 2,
        signups: [1, 2, 3],
        print: false,
      },
      {
        id: 3,
        signups: [1, 2, 3],
        print: true,
      },
    ])
  })

  test('CREATE_MEAL', () => {
    const action = {
      status: 'complete',
      type: 'CREATE_MEAL',
      data: { meal: { test: 'test' } },
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
      },
      {
        id: 2,
        signups: [1, 2, 3],
      },
      {
        id: 3,
        signups: [1, 2, 3],
      },
      {
        test: 'test',
        signups: [],
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('CANCEL_MEAL', () => {
    const action = {
      status: 'complete',
      type: 'CANCEL_MEAL',
      id: 3,
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
      },
      {
        id: 2,
        signups: [1, 2, 3],
      },
    ])

    action.status = 'incomplete'
    expect(
      meal(
        {
          id: 3,
          signups: [1, 2, 3],
        },
        action,
      ),
    ).toEqual({
      id: 3,
      signups: [1, 2, 3],
    })
  })

  test('EDIT_MEAL', () => {
    const action = {
      status: 'complete',
      type: 'EDIT_MEAL',
      data: { test: 'test', id: 2 },
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
      },
      {
        id: 2,
        test: 'test',
        signups: [1, 2, 3],
      },
      {
        id: 3,
        signups: [1, 2, 3],
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('FINALIZE_PRICES, SUBMIT_PRICES', () => {
    const action = {
      status: 'complete',
      type: 'FINALIZE_PRICES',
      mealId: 2,
      prices: [
        { id: 2, price: 5, db: 'meals' },
        { id: 5, price: 5, db: 'mealOptions' },
        { id: 2, price: 5, db: 'mealOptions' },
        { id: 4, price: 5, db: 'mealOptionValues' },
        { id: 3, price: 5, db: 'mealOptionValues' },
      ],
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            price: 0,
            options: [
              { id: 2, values: [{ id: 4, price: 2 }, { id: 1 }] },
              { id: 4, price: 2, values: [{ id: 5, price: 2 }, { id: 3 }] },
              { id: 5, price: 2, values: [] },
              { id: 1, values: [] },
            ],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        signups: [1, 2, 3],
      },
      {
        id: 2,
        price: 5,
        locked: true,
        options: [
          { id: 2, price: 5, values: [{ id: 4, price: 5 }, { id: 1 }] },
          {
            id: 4,
            price: 2,
            values: [{ id: 5, price: 2 }, { id: 3, price: 5 }],
          },
          { id: 5, price: 5, values: [] },
          { id: 1, values: [] },
        ],
      },
      {
        id: 3,
        signups: [1, 2, 3],
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('INITIAL_MEALS', () => {
    const action = {
      status: 'complete',
      type: 'INITIAL_MEALS',
      data: [{ test: 'test' }],
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([{ test: 'test' }])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('REFRESH', () => {
    const action = {
      status: 'complete',
      type: 'REFRESH',
      data: {
        meals: [{ test: 'test', id: 2 }, { test: 'test', id: 3 }, { test: 'test', id: 4 }],
        signups: [{ meal: 2, id: 1 }, { meal: 2, id: 2 }, { meal: 2, id: 3 }, { meal: 4, id: 1 }, { meal: 4, id: 2 }],
      },
    }

    expect(
      meal(
        [
          {
            id: 1,
            signups: [1, 2, 3],
          },
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([{ test: 'test', id: 2, signups: [1, 2, 3] }, { test: 'test', id: 3, signups: [] }, { test: 'test', id: 4, signups: [1, 2] }])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('INITIAL_SIGNUPS', () => {
    const action = {
      status: 'complete',
      type: 'INITIAL_SIGNUPS',
      data: [{ meal: 2, id: 1 }, { meal: 2, id: 2 }, { meal: 2, id: 3 }, { meal: 4, id: 1 }, { meal: 4, id: 2 }],
    }

    expect(
      meal(
        [
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [1, 2, 3],
          },
          {
            id: 4,
            signups: [1, 2, 3],
          },
        ],
        action,
      ),
    ).toEqual([{ id: 2, signups: [1, 2, 3] }, { id: 3, signups: [] }, { id: 4, signups: [1, 2] }])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('MEAL_CANCEL', () => {
    const action = {
      status: 'complete',
      type: 'MEAL_CANCEL',
      id: 3,
    }

    expect(
      meal(
        [
          {
            id: 2,
            signups: [1, 2, 3],
          },
          {
            id: 3,
            signups: [4, 5, 6],
          },
          {
            id: 4,
            signups: [7, 8, 9],
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 2,
        signups: [1, 2],
      },
      {
        id: 3,
        signups: [4, 5, 6],
      },
      {
        id: 4,
        signups: [7, 8, 9],
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('FINALIZE_DATEFINDER', () => {
    const action = {
      type: 'FINALIZE_DATEFINDER',
      status: 'complete',
      id: 1,
      data: {
        deadline: 1,
        time: 2,
        datefinder: 3,
        datefinderLocked: 4,
      },
    }

    expect(
      meal(
        [
          {
            id: 1,
            deadline: 9,
            time: 8,
            datefinder: 7,
            datefinderLocked: 6,
          },
          {
            id: 2,
            deadline: 9,
            time: 8,
            datefinder: 7,
            datefinderLocked: 6,
          },
        ],
        action,
      ),
    ).toEqual([
      {
        id: 1,
        deadline: 1,
        time: 2,
        datefinder: 3,
        datefinderLocked: 4,
      },
      {
        id: 2,
        deadline: 9,
        time: 8,
        datefinder: 7,
        datefinderLocked: 6,
      },
    ])

    action.status = 'incomplete'
    expect(meal('test', action)).toEqual('test')
  })

  test('default', () => {
    const action = {
      type: 'asdawd',
      status: 'complete',
      id: 1,
    }

    expect(
      meal(
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
