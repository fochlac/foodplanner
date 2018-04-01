import { close_dialog, create_meal, edit_meal, load_history } from 'STORE/actions.js'

import CreateMealDialog from './CreateMealDialog/CreateMealDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const edit = ownProps.type === 'edit',
    meal = ownProps.id !== undefined ? state.meals.filter(meal => meal.id === ownProps.id)[0] : {}

  const historyLoaded = Array(state.app.historySize)
    .fill()
    .slice(0, 50)
    .map((val, index) => state.historyMealMap[index])
    .every(id => id)

  return {
    invalid: !meal,
    app: state.app,
    user: state.user,
    meal: meal ? meal : {},
    meals: state.meals,
    datefinder: meal.datefinder ? state.datefinder.find(datefinder => datefinder.id === meal.datefinder) : {},
    edit,
    historyLoaded,
  }
}

export default connect(mapStateToProps, { create_meal, edit_meal, close_dialog, load_history })(CreateMealDialog)
