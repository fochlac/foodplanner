import app from 'STORE/reducers/app.js'

describe('app-reducer', () => {
  test('DIALOG', () => {
    const action = {
      type: 'DIALOG',
      content: 'test1',
      option: 'test2',
    }

    expect(app({}, action)).toEqual({
      dialog: {
        type: action.content,
        option: action.option,
      },
    })

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
      dialog: {
        type: action.content,
        option: action.option,
      },
    })
  })
  test('CLOSE_DIALOG', () => {
    const action = {
      type: 'CLOSE_DIALOG',
    }

    expect(app({}, action)).toEqual({
      dialog: { type: '' },
      userSuggestions: undefined,
    })

    expect(
      app(
        {
          test4: '12312534',
          dialog: 'test',
          userSuggestions: ['test'],
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
      dialog: { type: '' },
      userSuggestions: undefined,
    })
  })

  test('HISTORY', () => {
    const action = {
      type: 'HISTORY',
      app: {
        test1: 'asdasd',
        errors: { asdas: 'asdaa' },
        busy: true,
        hiddenBusy: true,
      },
      option: 'test2',
    }

    expect(
      app(
        {},
        {
          type: 'HISTORY',
          app: {
            test1: 'asdasd',
            errors: { asdas: 'asdaa' },
            busy: true,
            hiddenBusy: true,
          },
          option: 'test2',
        },
      ),
    ).toEqual({
      test1: 'asdasd',
      errors: {},
      busy: false,
      hiddenBusy: false,
      busyList: [],
      offline: false,
    })

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test1: 'asdasd',
      errors: {},
      busy: false,
      hiddenBusy: false,
      busyList: [],
      offline: false,
    })
  })

  test('SEARCH_USER', () => {
    const action = {
      type: 'SEARCH_USER',
      status: 'complete',
      data: {
        test: 'test123',
      },
    }

    expect(app({}, action)).toEqual({
      userSuggestions: action.data,
    })

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      userSuggestions: action.data,
      test4: '12312534',
    })

    action.data.error = true

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      userSuggestions: undefined,
      test4: '12312534',
    })

    expect(
      app(
        {
          test4: '12312534',
          userSuggestions: 'test123',
        },
        action,
      ),
    ).toEqual({
      userSuggestions: undefined,
      test4: '12312534',
    })

    action.status = false

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      test4: '12312534',
    })
  })

  test('SEND_MONEY, SIGNOUT, SAVE_SETTINGS', () => {
    const action = {
        type: 'SIGNOUT',
      },
      initialState = {
        test: '1231',
        userSuggestions: '12312',
        dialog: '12312',
      },
      cleanState = {
        test: '1231',
        userSuggestions: undefined,
        dialog: { type: '' },
      }

    expect(app(initialState, action)).toEqual(cleanState)

    action.type = 'asdaw'
    action.status = 'complete'
    action.data = {}

    expect(app(initialState, action)).toEqual(initialState)

    action.type = 'SEND_MONEY'

    expect(app(initialState, action)).toEqual(cleanState)

    action.data.error = true

    expect(app(initialState, action)).toEqual(initialState)

    action.data.error = false
    action.status = false

    expect(app(initialState, action)).toEqual(initialState)

    action.type = 'SIGNOUT'

    expect(app(initialState, action)).toEqual(cleanState)
  })

  test('MEAL_SIGNUP, MEAL_EDIT, CREATE_MEAL, CANCEL_MEAL, SUBMIT_PRICES, EDIT_MEAL', () => {
    const action = {
        type: 'MEAL_SIGNUP',
        status: 'complete',
      },
      initialState = {
        test: '1231',
        mailSuggestion: '12312',
        dialog: '12312',
      },
      cleanState = {
        test: '1231',
        mailSuggestion: '12312',
        dialog: { type: '' },
      }

    expect(app(initialState, action)).toEqual(cleanState)

    action.status = 'complete'

    action.status = false

    expect(app(initialState, action)).toEqual(initialState)
  })

  test('BUSY', () => {
    const action = {
        type: 'BUSY',
        state: 'complete',
      },
      initialState = {
        test: '1231',
      },
      cleanState = {
        test: '1231',
        busy: 'complete',
      }

    expect(app(initialState, action)).toEqual(cleanState)
  })

  test('HIDDEN_BUSY', () => {
    let action = {
        type: 'HIDDEN_BUSY',
        state: true,
      },
      initialState = {
        test: '1231',
      },
      cleanState = {
        test: '1231',
        hiddenBusy: true,
        busyList: [],
      }

    expect(app(initialState, action)).toEqual(cleanState)

    action.busyType = 'test'
    cleanState.busyList = ['test']

    expect(app(initialState, action)).toEqual(cleanState)

    action.state = false
    cleanState.busyList = []
    initialState.busyList = ['test']
    initialState.hiddenBusy = true
    expect(app(initialState, action)).toEqual(cleanState)

    cleanState.hiddenBusy = false
    action.final = true
    expect(app(initialState, action)).toEqual(cleanState)
  })

  test('POSTMESSAGE', () => {
    const action = {
      type: 'POSTMESSAGE',
      message: 'offline',
      payload: { state: true },
    }

    expect(app({}, action)).toEqual({ offline: true })

    action.payload.state = 'asdas'

    expect(
      app(
        {
          test: '123',
          offline: true,
        },
        action,
      ),
    ).toEqual({
      test: '123',
      offline: 'asdas',
    })

    action.message = 'asdas'

    expect(
      app(
        {
          test: '123',
        },
        action,
      ),
    ).toEqual({
      test: '123',
    })
  })

  test('SHOW_ERROR', () => {
    const action = {
      type: 'SHOW_ERROR',
      id: 10,
      content: 'test',
    }

    expect(app({}, action)).toEqual({
      errors: {
        10: 'test',
      },
    })

    expect(
      app(
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
        10: 'test',
      },
    })
  })

  test('DELETE_ERROR', () => {
    const action = {
      type: 'DELETE_ERROR',
      id: 10,
    }

    expect(
      app(
        {
          errors: {
            10: 'test',
          },
        },
        action,
      ),
    ).toEqual({
      errors: {},
    })

    expect(
      app(
        {
          test: '123',
          errors: {
            1: 'asd',
            10: 'test',
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
      data: {
        version: 10,
        historySize: 8,
      },
    }

    expect(app({}, action)).toEqual({
      dataversion: 10,
      historySize: 8,
    })

    expect(
      app(
        {
          dataversion: 9,
          historySize: 5,
        },
        action,
      ),
    ).toEqual({
      dataversion: 10,
      historySize: 8,
    })

    action.status = false

    expect(
      app(
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

  test('LOAD_HISTORY', () => {
    const action = {
      type: 'LOAD_HISTORY',
      status: 'complete',
      data: {
        historySize: 8,
      },
    }

    expect(app({}, action)).toEqual({
      historySize: 8,
    })

    expect(
      app(
        {
          dataversion: 9,
          historySize: 5,
        },
        action,
      ),
    ).toEqual({
      dataversion: 9,
      historySize: 8,
    })

    action.status = false

    expect(
      app(
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

  test('CHECK_DOMAIN', () => {
    const action = {
      type: 'CHECK_DOMAIN',
      status: 'complete',
      data: 'test',
    }

    expect(app({}, action)).toEqual({
      subdomain: 'test',
    })

    expect(
      app(
        {
          dataversion: 9,
          subdomain: 'te1234st',
        },
        action,
      ),
    ).toEqual({
      dataversion: 9,
      subdomain: 'test',
    })

    action.status = false

    expect(
      app(
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

  test('default', () => {
    const action = {
      type: 'asdawd',
      status: 'complete',
      id: 1,
    }

    expect(
      app(
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
