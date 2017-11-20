const app = (state = {}, action) => {
    switch (action.type) {
        case 'DIALOG':
            return {...state, dialog: {type: action.content, option: action.option}};
        case 'HIDE_MAIL_SUGGESTION':
        case 'SELECT_MAIL':
            return {...state, mailSuggestion: undefined};
        case 'CHECK_MAIL':
            if (action.status === 'complete' && !action.data.error) {
                return {...state, mailSuggestion: action.data};
            } else if (action.status === 'complete') {
                return {...state, mailSuggestion: undefined};
            }
            return state;
        case 'SAVE_SETTINGS':
        case 'MEAL_SIGNUP':
        case 'MEAL_EDIT':
        case 'CREATE_MEAL':
        case 'CANCEL_MEAL':
        case 'EDIT_MEAL':
            if (action.status === 'complete') {
                return {...state, dialog: {type: ""}};
            }
            return state;
        case 'BUSY':
            return {...state, busy: action.state};

        default:
            return state;
    }
}

export default app;