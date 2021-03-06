import { cancel_meal, close_dialog, datefinderDeleteDate, save_settings_locally } from 'STORE/actions.js'

import ConfirmationDialog from './ConfirmationDialog/ConfirmationDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  return ownProps
}

export default connect(mapStateToProps, { cancel_meal, close_dialog, save_settings_locally, datefinderDeleteDate })(ConfirmationDialog)
