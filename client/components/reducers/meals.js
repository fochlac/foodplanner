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
            return state;
        case 'DIALOG':
            if (action.content === 'PRINT_MEAL') {
                return state.map(meal => ({...meal, print: false}));
            }
            return state;

        case 'PRINT_MEAL':
            return state.map(meal => ({...meal, print: action.ids.includes(meal.id)}));

        case 'CREATE_MEAL':
            if (action.status === 'complete') {
                action.data.signups = [];
                return [...state, action.data];
            }
            return state;

        case 'CANCEL_MEAL':
            if (action.status === 'complete') {
                let newState = state.concat([]);
                return newState.filter(meal => meal.id !== action.id);
            }
            return state;

        case 'EDIT_MEAL':
            if (action.status === 'complete') {
                let newState = [].concat(state),
                    mealIndex = newState.findIndex(meal => (meal.id === action.data.id));

                newState[mealIndex] = Object.assign({}, newState[mealIndex], action.data);
                return newState;
            }
            return state;

        case 'FINALIZE_PRICES':
        case 'SUBMIT_PRICES':
            if (action.status === 'complete') {
                let newState = [].concat(state),
                    mealIndex = newState.findIndex(meal => (meal.id === action.mealId)),
                    priceReference = action.prices.reduce((acc, priceObj) => {
                        switch(priceObj.db) {
                            case 'meals':
                                acc.m = priceObj.price ? priceObj.price : 0;
                                break;
                            case 'mealOptions':
                                acc.o[priceObj.id] = priceObj.price;
                                break;
                            case 'mealOptionValues':
                                acc.v[priceObj.id] = priceObj.price;
                                break;
                        }
                        return acc;
                    }, {o:{}, v:{}}),
                    clonedMeal = Object.assign({}, newState[mealIndex], (priceReference.m ? {price: priceReference.m} : {}));

                clonedMeal.options = newState[mealIndex].options.map(option => Object.assign(
                    {},
                    option,
                    (priceReference.o[option.id] ? {price: priceReference.o[option.id]} : {}),
                    {values: option.values.map(value => (priceReference.v[value.id] ? Object.assign({}, value, {price: priceReference.v[value.id]}) : value))}
                ));

                if (action.type === 'FINALIZE_PRICES') {
                    clonedMeal.locked = true;
                }

                newState[mealIndex] = clonedMeal;
                return newState;
            }
            return state;

        case 'INITIAL_MEALS':
            if (action.status === 'complete') {
                return action.data.map(newMeal => {
                    let oldMeal = state.find((meal) => meal.id === newMeal.id);
                    if (oldMeal) {
                        newMeal = Object.assign({}, oldMeal, newMeal);
                    } else {
                        newMeal.signups = [];
                    }
                    return newMeal;
                });
            }
            return state;

        case 'REFRESH':
            if (action.status === 'complete' && action.data.meals) {
                let helper = action.data.signups.reduce((acc, signup) => {
                    if (!acc[signup.meal]) {
                        acc[signup.meal] = [];
                    }
                    acc[signup.meal] = acc[signup.meal].concat([signup.id]);
                    return acc;
                }, {});

                action.data.meals.forEach(meal => {
                    meal.signups = helper[meal.id] ? helper[meal.id] : [];
                });

                return action.data.meals;
            }
            return state;

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
            return state;

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
            return state;

        default:
            return state
    }
}

export default meals;