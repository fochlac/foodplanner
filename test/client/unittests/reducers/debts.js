import debts from 'STORE/reducers/debts.js'

describe('debts-reducer', () => {

  test('REFRESH', () => {
    const action = {
      type: 'REFRESH',
      status: 'complete',
      data: {}
    }

    expect(
      debts(
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

    action.data.debts = 'penis'

    expect(
      debts(
        {
          test: '123',
          errors: {
            1: 'asd',
          },
        },
        action,
      ),
    ).toEqual('penis')
  })

  test('default', () => {
    const action = {
      type: 'asdawd',
      status: 'complete',
      id: 1,
    }

    expect(
      debts(
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
