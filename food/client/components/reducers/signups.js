const signups = (state = {}, action) => {
    switch (action.type) {
        case 'MEAL_EDIT':
            if (action.status === 'complete') {
                return {...state, [action.data.id]: Object.assign({}, state[action.data.id], action.data)};
            }
        case 'MEAL_SIGNUP':
            if (action.status === 'complete') {
                return {...state, [action.data.id]: action.data};
            }
        case 'INITIAL_SIGNUPS':
            if (action.status === 'complete') {
                return action.data.reduce((acc,signup) => {
                    acc[signup.id] = signup;
                    return acc;
                }, {});
            }
        case 'MEAL_CANCEL':
            if (action.status === 'complete') {
                delete state[action.id];
            }
        default:
            return state
    }
}

export default signups;