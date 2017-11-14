import { addActionId } from 'STORE/middleware/addActionId.js'

describe('addActionId', () => {
  test('should add an action id to each action', () => {
    addActionId()(action => {
      expect(action.actionId).toBe(1)
    })({})

    addActionId()(action => {
      expect(action.actionId).toBe(2)
    })({})

    addActionId()(action => {
      expect(action.actionId).toBe(2)
    })({ actionId: 2 })

    addActionId()(action => {
      expect(action.actionId).toBe(3)
    })({})
  })
})
