import { close_dialog, meal_set_print } from 'STORE/actions.js'

import PrintDialog from './PrintDialog/PrintDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    meals: state.meals,
    ...ownProps,
  }
}

export default connect(mapStateToProps, { close_dialog, meal_set_print })(PrintDialog)
