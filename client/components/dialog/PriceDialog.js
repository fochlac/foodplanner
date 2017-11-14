import { close_dialog, start_payment, submit_prices, toggle_paid } from 'STORE/actions.js'

import PriceDialog from './PriceDialog/PriceDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  let meal = state.meals.find(meal => meal.id === ownProps.id)
  if (meal) {
    return {
      meal,
      signups: meal.signups.map(id => state.signups[id]),
    }
  }
  return {
    invalid: true,
  }
}

export default connect(mapStateToProps, { close_dialog, submit_prices, start_payment, toggle_paid })(PriceDialog)
