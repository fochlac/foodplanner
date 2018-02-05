import { cancel_meal, close_dialog, save_settings_locally } from 'STORE/actions.js'

import ConfirmationDialog from 'UI/ConfirmationDialog/ConfirmationDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return ownProps
}

export default connect(mapStateToProps, { cancel_meal, close_dialog, save_settings_locally })(ConfirmationDialog)
