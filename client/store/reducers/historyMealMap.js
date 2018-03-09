const historyMealMap = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_HISTORY':
      if (action.status === 'complete') {
        let newState = {...state}

        action.data.meals.forEach((meal, index) => {
          newState[(action.size * (action.page - 1) + index)] = meal.id
        })
        return newState
      }
      return state

    case 'REFRESH':
      if (action.status === 'complete' && action.data.meals) {
        return {}
      }
      return state

    default:
      return state
  }
}

export default historyMealMap
