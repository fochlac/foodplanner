import datefinder from 'STORE/reducers/datefinder.js'

const datefinderSample = [
  {
    id: 1,
    deadline: 123456789,
    participants: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }],
    dates: [
      {
        id: 1,
        users: [{ user: 1, name: 'asd' }],
      },
      {
        id: 2,
        users: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }],
      },
    ],
  },
  {
    id: 2,
    deadline: 123456789,
    participants: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
    dates: [
      {
        id: 3,
        users: [{ user: 1, name: 'asd' }, { user: 3, name: 'asd' }],
      },
      {
        id: 4,
        users: [{ user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
      },
    ],
  },
]

describe('datefinder-reducer', () => {
  test('TOGGLE_DATEFINDER_SIGNUP', () => {
    let action = {
      type: 'TOGGLE_DATEFINDER_SIGNUP',
      status: 'complete',
      selected: true,
      date: 2,
      user: { id: 2, name: 'asd' },
    }

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          deadline: 123456789,
          participants: expect.arrayContaining([{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }]),
          dates: expect.arrayContaining([
            {
              id: 2,
              users: [{ user: 1, name: 'asd' }],
            },
          ]),
        },
      ]),
    )

    action.selected = false
    action.user.id = 4

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          deadline: 123456789,
          participants: expect.arrayContaining([{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 4, name: 'asd' }]),
          dates: expect.arrayContaining([
            {
              id: 2,
              users: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 4, name: 'asd' }],
            },
          ]),
        },
      ]),
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('DATEFINDER_DELETE_DATE', () => {
    const action = {
      type: 'DATEFINDER_DELETE_DATE',
      status: 'complete',
      datefinder: 2,
      date: 3
    }

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          id: 2,
          deadline: 123456789,
          participants: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
          dates: [
            {
              id: 4,
              users: [{ user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
            },
          ],
        },
      ]),
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('DATEFINDER_ADD_DATE', () => {
    const action = {
      type: 'DATEFINDER_ADD_DATE',
      status: 'complete',
      datefinder: 2,
      time: 123456789,
      data: {
        id: 5,
        time: 123456789,
      }
    }

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          id: 2,
          deadline: 123456789,
          participants: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
          dates: [
            {
              id: 3,
              users: [{ user: 1, name: 'asd' }, { user: 3, name: 'asd' }],
            },
            {
              id: 4,
              users: [{ user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
            },
            {
              id: 5,
              time: 123456789,
              users: [],
            },
          ],
        },
      ]),
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('DATEFINDER_SET_DEADLINE', () => {
    const action = {
      type: 'DATEFINDER_SET_DEADLINE',
      status: 'complete',
      datefinder: 2,
      deadline: 987654321,
    }

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          id: 2,
          deadline: 987654321,
          participants: [{ user: 1, name: 'asd' }, { user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
          dates: [
            {
              id: 3,
              users: [{ user: 1, name: 'asd' }, { user: 3, name: 'asd' }],
            },
            {
              id: 4,
              users: [{ user: 2, name: 'asd' }, { user: 3, name: 'asd' }],
            }
          ],
        },
      ]),
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('CREATE_MEAL', () => {
    const action = {
      type: 'CREATE_MEAL',
      status: 'complete',
      data: {datefinder: {test: 'test'}}
    }

    expect(datefinder(datefinderSample, action)).toEqual(
      expect.arrayContaining([
        {
          test: 'test'
        },
      ]),
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('REFRESH', () => {
    const action = {
      type: 'REFRESH',
      status: 'complete',
      data: {datefinder: [{id: 1, test: 'test'}]}
    }

    expect(datefinder(datefinderSample, action)).toEqual([
        {
          id: 1,
          test: 'test'
        },
      ]
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('LOAD_HISTORY', () => {
    const action = {
      type: 'LOAD_HISTORY',
      status: 'complete',
      data: { datefinder: [{ id: 1, test: 'test' }] }
    }

    expect(datefinder(datefinderSample, action)).toEqual([
      datefinderSample[1],
      {
        id: 1,
        test: 'test'
      },
    ]
    )

    action.status = 'incomplete'

    expect(
      datefinder(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('default', () => {
    const action = {
      type: 'asdawd',
      status: 'complete',
      id: 1,
    }

    expect(
      datefinder(
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
