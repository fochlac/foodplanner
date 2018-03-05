import { set_busy, set_hidden_busy } from 'STORE/actions.js'

import { handleAssync } from 'STORE/middleware/handleAssync.js'

describe('handleAssync', () => {
  test('should set busy state correctly', () => {
    let act1 = { status: 'initialized', actionId: 1 },
      act1c = { status: 'complete', actionId: 1 },
      act2 = { status: 'initialized', actionId: 2 },
      act2c = { status: 'complete', actionId: 2 },
      act3 = { status: 'hidden', actionId: 3 },
      act3c = { status: 'complete', actionId: 3 },
      act4 = { status: 'hidden', actionId: 4 },
      act4c = { status: 'complete', actionId: 4 }

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_busy(true))
      },
    })(action => {
      expect(action).toEqual(act1)
    })(act1)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_busy(false))
      },
    })(action => {
      expect(action).toEqual(act1c)
    })(act1c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_busy(true))
      },
    })(action => {
      expect(action).toEqual(act1)
    })(act1)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act2)
    })(act2)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act1c)
    })(act1c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_busy(false))
      },
    })(action => {
      expect(action).toEqual(act2c)
    })(act2c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(true))
      },
    })(action => {
      expect(action).toEqual(act3)
    })(act3)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act4)
    })(act4)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act3c)
    })(act3c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(false))
      },
    })(action => {
      expect(action).toEqual(act4c)
    })(act4c)
  })

  test('should handle hidden busy stacks correctly', () => {
    const act3 = { status: 'hidden', actionId: 3, busyType: 'test1' },
      act3c = { status: 'complete', actionId: 3, busyType: 'test1' },
      act4 = { status: 'hidden', actionId: 4, busyType: 'test2' },
      act4c = { status: 'complete', actionId: 4, busyType: 'test2' },
      act5 = { status: 'hidden', actionId: 5, busyType: 'test2' },
      act5c = { status: 'complete', actionId: 5, busyType: 'test2' }

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(true, { busyType: 'test1' }))
      },
    })(action => {
      expect(action).toEqual(act3)
    })(act3)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(true, { busyType: 'test2' }))
      },
    })(action => {
      expect(action).toEqual(act4)
    })(act4)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act5)
    })(act5)

    handleAssync({
      dispatch: action => {
        expect(0).toEqual(1)
      },
    })(action => {
      expect(action).toEqual(act4c)
    })(act4c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(false, { busyType: 'test1', final: false }))
      },
    })(action => {
      expect(action).toEqual(act3c)
    })(act3c)

    handleAssync({
      dispatch: action => {
        expect(action).toEqual(set_hidden_busy(false, { busyType: 'test2', final: true }))
      },
    })(action => {
      expect(action).toEqual(act5c)
    })(act5c)
  })
})
