const users = (state = {}, action) => {
  switch (action.type) {
    case 'TOGGLE_DATEFINDER_SIGNUP':
      if (action.status === 'complete') {
        const newState = state.concat([]),
          datefinderIndex = state.findIndex(datefinder => datefinder.dates.filter(date => date.id === action.date).length),
          dateIndex = state[datefinderIndex].dates.findIndex(date => date.id === action.date),
          newDates = state[datefinderIndex].dates.filter((date, index) => index !== dateIndex),
          newUsers = action.selected
            ? state[datefinderIndex].dates[dateIndex].users.filter(user => user.user !== action.user.id)
            : state[datefinderIndex].dates[dateIndex].users.concat([{ user: action.user.id, name: action.user.name }]),
          newDate = Object.assign({}, state[datefinderIndex].dates[dateIndex], { users: newUsers })

        newState[datefinderIndex] = {
          ...newState[datefinderIndex],
          dates: [...newDates, newDate],
          participants: [...newState[datefinderIndex].participants.filter(user => user.user !== action.user.id), { user: action.user.id, name: action.user.name }]
        }
        return newState
      }
      return state

    case 'DATEFINDER_DELETE_DATE':
      if (action.status === 'complete') {
        const newState = state.concat([]),
          datefinderIndex = state.findIndex(datefinder => datefinder.id === action.datefinder)

        newState[datefinderIndex] = { ...state[datefinderIndex], dates: state[datefinderIndex].dates.filter(date => date.id !== action.date) }
        return newState
      }
      return state

    case 'DATEFINDER_ADD_DATE':
      if (action.status === 'complete') {
        const newState = state.concat([]),
          datefinderIndex = state.findIndex(datefinder => datefinder.id === action.datefinder)

        newState[datefinderIndex] = { ...state[datefinderIndex], dates: [...state[datefinderIndex].dates, { users: [], ...action.data }] }
        return newState
      }
      return state

    case 'DATEFINDER_SET_DEADLINE':
      if (action.status === 'complete') {
        const newState = state.concat([]),
          datefinderIndex = state.findIndex(datefinder => datefinder.id === action.datefinder)

        newState[datefinderIndex] = { ...state[datefinderIndex], deadline: action.deadline }
        return newState
      }
      return state

    case 'CREATE_MEAL':
      if (action.status === 'complete' && Object.keys(action.data.datefinder).length) {
        return [...state, action.data.datefinder]
      }
      return state

    default:
      return state
  }
}

export default users
