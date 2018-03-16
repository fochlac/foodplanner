const instance = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_INSTANCE':
      if (action.status === 'complete') {
        return action.data.instance
      }
      return state

    default:
      return state
  }
}

export default instance
