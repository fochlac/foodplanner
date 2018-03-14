import { close_dialog, load_history, send_money, toggle_paid } from 'STORE/actions.js'

import IncomingPaymentsDialog from 'UI/IncomingPaymentsDialog/IncomingPaymentsDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const historyLoaded = Array(state.app.historySize)
    .fill()
    .slice(0, 20)
    .map((val, index) => state.historyMealMap[index])
    .every(id => id)
  return {
    userId: state.user.id,
    meals: state.meals,
    signups: state.signups,
    historyLoaded,
  }
}

export default connect(mapStateToProps, { close_dialog, send_money, toggle_paid, load_history })(IncomingPaymentsDialog)
