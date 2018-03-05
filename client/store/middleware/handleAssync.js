import { set_busy, set_hidden_busy } from 'STORE/actions.js'

let runningActions = {},
  hiddenActions = {}

export const handleAssync = store => next => action => {
  if (action.status === 'initialized') {
    if (!Object.keys(runningActions).length) {
      store.dispatch(set_busy(true))
    }
    runningActions[action.actionId] = 'running'
  } else if (action.status === 'hidden') {
    if (!Object.keys(hiddenActions).length || action.busyType && !Object.values(hiddenActions).filter(storedType => storedType === action.busyType).length) {
      store.dispatch(set_hidden_busy(true, {busyType: action.busyType}))
    }
    hiddenActions[action.actionId] = action.busyType
  } else if (action.status === 'complete' || action.status === 'failure') {
    if (runningActions[action.actionId]) {
      delete runningActions[action.actionId]
      if (!Object.keys(runningActions).length) {
        store.dispatch(set_busy(false))
      }
    } else if (hiddenActions[action.actionId]) {
      const busyType = hiddenActions[action.actionId]
      delete hiddenActions[action.actionId]
      if (!Object.keys(hiddenActions).length || action.busyType && !Object.values(hiddenActions).filter(storedType => storedType === busyType).length) {
        store.dispatch(set_hidden_busy(false, {final: !Object.keys(hiddenActions).length, busyType}))
      }
    }
  }
  next(action)
}
