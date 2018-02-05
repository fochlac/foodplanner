import { close_dialog, send_money, toggle_paid } from 'STORE/actions.js'

import IncomingPaymentsDialog from 'UI/IncomingPaymentsDialog/IncomingPaymentsDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    userId: state.user.id,
    meals: state.meals,
    signups: state.signups,
  }
}

export default connect(mapStateToProps, { close_dialog, send_money, toggle_paid })(IncomingPaymentsDialog)
