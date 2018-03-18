const instance = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_INSTANCE':
      if (action.status === 'complete') {
        return { ...state, ...action.data.instance }
      }
      return state
    case 'LOAD_ALL_USERS':
      if (action.status === 'complete') {
        return { ...state, users: action.data }
      }
      return state
    case 'SET_ADMIN':
      if (action.status === 'complete') {
        const index = state.users.findIndex(user => user.id === action.user)
        const newUsers = [].concat(state.users)
        newUsers[index] = { ...newUsers[index], admin: action.admin }
        return { ...state, users: newUsers }
      }
      return state
    case 'DELETE_USER':
      if (action.status === 'complete') {
        return { ...state, users: state.users.filter(user => user.id !== action.user) }
      }
      return state
    case 'LOAD_ALL_TRANSACTIONS':
      if (action.status === 'complete') {
        return { ...state, transactions: action.data }
      }
      return state
    case 'LOGOUT':
      if (action.status === 'complete' && state.page === 'landing') {
        return { isSubdomain: state.isSubdomain, root: state.root, page: 'landing' }
      }
      return state
    case 'LOAD_INSTANCE':
      if (action.status === 'complete') {
        return { ...state, ...action.data }
      }
      return state

    default:
      return state
  }
}

export default instance
