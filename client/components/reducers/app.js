const app = (state = {}, action) => {
    switch (action.type) {
        case 'DIALOG':
            return {...state, dialog: {type: action.content, option: action.option}};

        case 'MEAL_SIGNUP':
        case 'MEAL_EDIT':
            if (action.status === 'complete') {
                return {...state, dialog: false};
            }

        default:
            return state
    }
}

export default app;