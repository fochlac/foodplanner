import app from './reducers/app.js'
import { combineReducers } from 'redux'
import datefinder from './reducers/datefinder.js'
import historyMealMap from './reducers/historyMealMap.js'
import meals from './reducers/meals.js'
import instance from './reducers/instance.js'
import signups from './reducers/signups.js'
import user from './reducers/user.js'
import debts from './reducers/debts.js'

const reducers = combineReducers({
  user,
  debts,
  meals,
  instance,
  signups,
  app,
  datefinder,
  historyMealMap,
})

export default reducers
