import { meal_cancel, start_cancel_meal, start_edit_meal, start_edit_price, start_meal_edit, start_meal_signup, start_print } from 'STORE/actions.js'

import Meal from './Meal/Meal.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  meal: state.meals.find(meal => meal.id === ownProps.id),
  signups: state.signups,
  user: state.user,
})

export default connect(mapStateToProps, { start_meal_signup, meal_cancel, start_meal_edit, start_cancel_meal, start_edit_meal, start_edit_price, start_print })(
  Meal,
)
