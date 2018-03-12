export const urlHandler = ({ getState }) => next => action => {
  if (action.url && (!action.status || action.status === 'complete')) {
    const state = getState()
    let app = {
      ...state.app,
      dialog: {
        type: action.content,
        option: action.option,
      },
      busy: false,
    }

    history.pushState(
      {
        app,
      },
      action.title,
      state.instance.subdomain ? action.url : `/${state.instance.id}${action.url}`,
    )
  }

  next(action)
}
