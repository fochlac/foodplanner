import { close_dialog, send_money } from 'STORE/actions.js'

import React from 'react'
import SendMoneyDialog from 'UI/SendMoneyDialog/SendMoneyDialog.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    app: state.app,
  }
}

export default connect(mapStateToProps, { close_dialog, send_money })(SendMoneyDialog)
