import { close_dialog, get_transaction_history } from 'STORE/actions.js'

import React from 'react'
import TransactionDialog from './TransactionDialog/TransactionDialog.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    transactions: state.user.transactions ? state.user.transactions : [],
  }
}

export default connect(mapStateToProps, { close_dialog, get_transaction_history })(TransactionDialog)
