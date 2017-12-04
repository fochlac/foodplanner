const signups = (state = {}, action) => {
    switch (action.type) {
        case 'MEAL_EDIT':
            if (action.status === 'complete') {
                return {...state, [action.data.id]: Object.assign({}, state[action.data.id], action.data)};
            }
            return state
        case 'SIGNUP_PAID':
            if (action.status === 'complete') {
                return {...state, [action.id]: Object.assign({}, state[action.id], {paid: action.state})};
            }
            return state
        case 'FINALIZE_PRICES':
            if (action.status === 'complete') {
                let newState =  {...state};

                action.data.forEach(signupState => newState[signupState.id] = Object.assign({}, newState[signupState.id], {price: signupState.price, paid: signupState.paid}));

                return newState;
            }
            return state
        case 'MEAL_SIGNUP':
            if (action.status === 'complete') {
                return {...state, [action.data.id]: action.data};
            }
            return state
        case 'INITIAL_SIGNUPS':
            if (action.status === 'complete') {
                return action.data.reduce((acc,signup) => {
                    acc[signup.id] = signup;
                    return acc;
                }, {});
            }
            return state
        case 'MEAL_CANCEL':
            if (action.status === 'complete') {
                delete state[action.id];
            }
            return state
        case 'SIGNUP_PAID':
            if (action.status === 'complete') {
                state[action.id].paid = action.state;
            }
            return state
        default:
            return state
    }
}

export default signups;