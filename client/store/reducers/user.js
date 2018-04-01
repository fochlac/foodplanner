const users = (state = {}, action) => {
  switch (action.type) {
    case 'INITIAL_USER':
      return { ...state, ...action.localSettings }

    case 'SIGNIN':
    case 'REGISTER':
      if (action.status === 'complete') {
        return { ...state, ...action.data }
      }
      return state
    case 'SAVE_SETTINGS':
      if (action.status === 'complete') {
        return { ...state, ...action.data, ...action.locally }
      }
      return state

    case 'TRANSACTIONS':
      if (action.status === 'complete') {
        return { ...state, transactions: action.data }
      }
      return state

    case 'SIGNOUT':
      return {}

    case 'SEND_MONEY':
      if (action.status === 'complete') {
        return { ...state, balance: state.balance - action.amount }
      }
      return state

    case 'CREATE_INSTANCE':
      if (action.status === 'complete') {
        return action.data.user
      }
      return state

    default:
      return state
  }
}

export default users
