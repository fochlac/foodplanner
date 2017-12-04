export const logMiddleware = store => next => action => {
    if (action.url) {
        history.pushState({
            type: 'dialog',
            dialog: this.state.app.dialog
        }, 'dialog', '/');
    }

    next(action);
}