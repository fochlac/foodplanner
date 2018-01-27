export const urlHandler = ({ getState }) => next => action => {
    if (action.url && (!action.status || action.status === 'complete')) {
        let app = {
                ...(getState().app),
                dialog: {
                    type: action.content,
                    option: action.option
                },
                busy: false
            };

        history.pushState({
            app
        }, action.title, action.url);

    }

    next(action);
}