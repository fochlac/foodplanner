import { close_dialog, create_meal, edit_meal } from 'STORE/actions.js'

import CreateMealDialog from 'UI/CreateMealDialog/CreateMealDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const edit = ownProps.type === 'edit',
    meal = ownProps.id !== undefined ? state.meals.filter(meal => meal.id === ownProps.id)[0] : {}

  return {
    invalid: !meal,
    app: state.app,
    user: state.user,
    meal: meal ? meal : {},
    meals: state.meals,
    datefinder: meal.datefinder ? state.datefinder.find(datefinder => datefinder.id === meal.datefinder) : {},
    edit,
  }
}

export default connect(mapStateToProps, { create_meal, edit_meal, close_dialog })(CreateMealDialog)
