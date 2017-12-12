export const urlHandler = ({ getState }) => next => action => {
    if (action.url) {
        let app ={...(getState().app), dialog: {type: action.content, option: action.option}};

        history.pushState({
            app,
        }, action.title, action.url);
    }

    next(action);
}