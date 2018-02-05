import app from 'COMPONENTS/reducers/app.js'

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

  test('HISTORY', () => {
    const action = {
      type: 'HISTORY',
      app: 'test1',
      option: 'test2',
      errors: { asdas: 'asdaa' },
      busy: true,
      hiddenBusy: true,
    }

    expect(
      app(
        {},
        {
          type: 'HISTORY',
          app: 'test1',
          option: 'test2',
        },
      ),
    ).toBe({
      type: 'HISTORY',
      app: 'test1',
      option: 'test2',
      busy: false,
      hiddenBusy: false,
    })

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toBe({
      type: 'HISTORY',
      app: 'test1',
      option: 'test2',
      busy: false,
      hiddenBusy: false,
    })
  })

  test('CHECK_MAIL', () => {
    const action = {
      type: 'CHECK_MAIL',
      status: 'complete',
      data: {
        test: 'test123',
      },
    }

    expect(app({}, action)).toEqual({
      mailSuggestion: action.data,
    })

    expect(
      app(
        {
          test4: '12312534',
        },
        action,
      ),
    ).toEqual({
      mailSuggestion: action.data,
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
      mailSuggestion: undefined,
      test4: '12312534',
    })

    expect(
      app(
        {
          test4: '12312534',
          mailSuggestion: 'test123',
        },
        action,
      ),
    ).toEqual({
      mailSuggestion: undefined,
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
        mailSuggestion: '12312',
        dialog: '12312',
      },
      cleanState = {
        test: '1231',
        mailSuggestion: undefined,
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
    const action = {
        type: 'HIDDEN_BUSY',
        state: 'complete',
      },
      initialState = {
        test: '1231',
      },
      cleanState = {
        test: '1231',
        hiddenBusy: 'complete',
      }

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
      },
    }

    expect(app({}, action)).toEqual({
      dataversion: 10,
    })

    expect(
      app(
        {
          dataversion: 9,
        },
        action,
      ),
    ).toEqual({
      dataversion: 10,
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
})
