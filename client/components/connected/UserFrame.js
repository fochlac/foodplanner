import { show_incoming_payments, show_transaction_history, start_send_money } from 'STORE/actions.js'

import React from 'react'
import UserFrame from './UserFrame/UserFrame.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, { show_transaction_history, start_send_money, show_incoming_payments })(UserFrame)
