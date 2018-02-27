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
        }
        return newState
      }
      return state

    default:
      return state
  }
}

export default users
