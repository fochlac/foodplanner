const app = (state = {}, action) => {
    switch (action.type) {
        case 'DIALOG':
            return {...state, dialog: {type: action.content, option: action.option}};




        case 'CHECK_MAIL':
            if (action.status === 'complete' && !action.data.error) {
                return {...state, emailSuggestion: action.data};
            } else if (action.status === 'complete') {
                return {...state, emailSuggestion: undefined};
            }
            return state;
        case 'MEAL_SIGNUP':
        case 'MEAL_EDIT':
        case 'CREATE_MEAL':
        case 'CANCEL_MEAL':
            if (action.status === 'complete') {
                return {...state, dialog: false};
            }

        default:
            return state;
    }
}

export default app;