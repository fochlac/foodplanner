import {filterDuplicatesById} from 'UTILS/helper.js'

const meals = (state = [], action) => {
  switch (action.type) {
    case 'MEAL_SIGNUP':
      if (action.status === 'complete') {
        let newArr = state.concat([]),
          correctIndex = state.findIndex(meal => meal.id === action.data.meal),
          oldObj = state[correctIndex],
          newObj = Object.assign({}, oldObj, {
            signups: oldObj.signups.concat([action.data.id]),
          })

        newArr[correctIndex] = newObj
        return newArr
      }
      return state
    case 'DIALOG':
      if (action.content === 'PRINT_MEAL') {
        return state.map(meal => ({ ...meal, print: false }))
      }
      return state

    case 'PRINT_MEAL':
      return state.map(meal => ({
        ...meal,
        print: action.ids.includes(meal.id),
      }))

    case 'CREATE_MEAL':
      if (action.status === 'complete') {
        action.data.meal.signups = []
        return [...state, action.data.meal]
      }
      return state

    case 'CANCEL_MEAL':
      if (action.status === 'complete') {
        let newState = state.concat([])
        return newState.filter(meal => meal.id !== action.id)
      }
      return state

    case 'EDIT_MEAL':
      if (action.status === 'complete') {
        let newState = [].concat(state),
          mealIndex = newState.findIndex(meal => meal.id === action.data.id)

        newState[mealIndex] = Object.assign({}, newState[mealIndex], action.data)
        return newState
      }
      return state

    case 'FINALIZE_PRICES':
    case 'SUBMIT_PRICES':
      if (action.status === 'complete') {
        let newState = [].concat(state),
          mealIndex = newState.findIndex(meal => meal.id === action.mealId),
          priceReference = action.prices.reduce(
            (acc, priceObj) => {
              switch (priceObj.db) {
                case 'meals':
                  acc.m = priceObj.price ? priceObj.price : 0
                  break
                case 'mealOptions':
                  acc.o[priceObj.id] = priceObj.price
                  break
                case 'mealOptionValues':
                  acc.v[priceObj.id] = priceObj.price
                  break
              }
              return acc
            },
            { o: {}, v: {} },
          ),
          clonedMeal = Object.assign({}, newState[mealIndex], priceReference.m ? { price: priceReference.m } : {})

        clonedMeal.options = newState[mealIndex].options.map(option =>
          Object.assign({}, option, priceReference.o[option.id] ? { price: priceReference.o[option.id] } : {}, {
            values: option.values.map(
              value =>
                priceReference.v[value.id]
                  ? Object.assign({}, value, {
                      price: priceReference.v[value.id],
                    })
                  : value,
            ),
          }),
        )

        if (action.type === 'FINALIZE_PRICES') {
          clonedMeal.locked = true
        }

        newState[mealIndex] = clonedMeal
        return newState
      }
      return state

    case 'INITIAL_MEALS':
      if (action.status === 'complete') {
        return action.data
      }
      return state

    case 'LOAD_HISTORY':
    case 'REFRESH':
      if (action.status === 'complete' && action.data.meals) {
        let helper = action.data.signups.reduce((acc, signup) => {
          if (!acc[signup.meal]) {
            acc[signup.meal] = []
          }
          acc[signup.meal] = acc[signup.meal].concat([signup.id])
          return acc
        }, {})

        action.data.meals.forEach(meal => {
          meal.signups = helper[meal.id] ? helper[meal.id] : []
        })

        if (action.type === 'REFRESH') {
          return action.data.meals
        } else if (action.type === 'LOAD_HISTORY') {
          let ids = [];
          return filterDuplicatesById([...state, ...action.data.meals])
        }
      }
      return state

    case 'INITIAL_SIGNUPS':
      if (action.status === 'complete') {
        let helper = action.data.reduce((acc, signup) => {
          if (!acc[signup.meal]) {
            acc[signup.meal] = []
          }
          acc[signup.meal] = acc[signup.meal].concat([signup])
          return acc
        }, {})

        return state.map(meal => ({
          ...meal,
          signups: helper[meal.id] ? helper[meal.id].map(signup => signup.id) : [],
        }))
      }
      return state

    case 'MEAL_CANCEL':
      if (action.status === 'complete') {
        let newArr = state.concat([]),
          correctIndex = state.findIndex(meal => meal.signups.includes(action.id)),
          oldObj = state[correctIndex],
          signups = oldObj.signups.filter(signupId => signupId !== action.id)

        newArr[correctIndex] = { ...oldObj, signups }
        return newArr
      }
      return state

    case 'FINALIZE_DATEFINDER':
      if (action.status === 'complete') {
        let newArr = state.concat([]),
          correctIndex = state.findIndex(meal => meal.id === action.id)

        newArr[correctIndex] = {
          ...state[correctIndex],
          deadline: action.data.deadline,
          time: action.data.time,
          datefinder: action.data.datefinder,
          datefinderLocked: action.data.datefinderLocked,
        }

        return newArr
      }
      return state

    case 'DATEFINDER_SET_DEADLINE':
      if (action.status === 'complete') {
        const newState = state.concat([]),
          mealIndex = state.findIndex(meal => meal.datefinder === action.datefinder)

        newState[mealIndex] = { ...state[mealIndex], time: action.deadline }
        return newState
      }
      return state

    default:
      return state
  }
}

export default meals
