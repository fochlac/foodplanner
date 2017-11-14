const meals = (state = [], action) => {
    switch (action.type) {
        case 'MEAL_SIGNUP':
            if (action.status === 'complete') {
                let newArr = state.concat([]),
                    correctIndex,
                    oldObj = state.filter((meal,index) => {
                        if (meal.id === action.data.meal) {
                            correctIndex = index;
                            return true;
                        }
                        return false;
                    })[0],
                    newObj = Object.assign({}, oldObj, {signups: oldObj.signups.concat([action.data.id])});

                newArr[correctIndex] = newObj;
                return newArr;
            }
        case 'CREATE_MEAL':
            if (action.status === 'complete') {
                action.data.signups = [];
                return [...state, action.data];
            }
        case 'CANCEL_MEAL':
            if (action.status === 'complete') {
                let newState = state.concat([]);
                return newState.filter(meal => meal.id !== action.id);
            }
        case 'EDIT_MEAL':
            if (action.status === 'complete') {
                let newState = state.concat([]);
                return newState.filter(meal => meal.id !== action.data.id).push(action.data);
            }
        case 'INITIAL_MEALS':
            if (action.status === 'complete') {
                return action.data.map(meal => {
                    meal.signups = [];
                    return meal;
                });
            }
        case 'INITIAL_SIGNUPS':
            if (action.status === 'complete') {
                let helper = action.data.reduce((acc, signup) => {
                    if (!acc[signup.meal]) {
                        acc[signup.meal] = [];
                    }
                    acc[signup.meal] = acc[signup.meal].concat([signup]);
                    return acc;
                }, {});

                return state.map(meal => {
                    if (helper[meal.id]) {
                        return Object.assign({}, meal, {signups: helper[meal.id].map(signup => signup.id)});
                    } else {
                        return meal;
                    }
                });
            }
        case 'MEAL_CANCEL':
            if (action.status === 'complete') {
                let newArr = state.concat([]),
                    correctIndex,
                    oldObj = state.filter((meal,index) => {
                        if (meal.signups.includes(action.id)) {
                            correctIndex = index;
                            return true;
                        }
                        return false;
                    })[0],
                    signups = oldObj.signups.concat([]);

                signups.splice(oldObj.signups.indexOf(action.id), 1);

                newArr[correctIndex] = Object.assign({}, oldObj, {signups});
                return newArr;
            }

        default:
            return state
    }
}

export default meals;