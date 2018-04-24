const debts = (state = [], action) => {
  switch (action.type) {
    case 'REFRESH':
      if (action.status === 'complete' && action.data.debts) {
        return action.data.debts
      }
      return state

    default:
      return state
  }
}

export default debts
