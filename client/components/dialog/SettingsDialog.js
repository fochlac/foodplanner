import { close_dialog, create_error, delete_error, save_settings, save_settings_locally, start_sign_in } from 'STORE/actions.js'

import React from 'react'
import SettingsDialog from './SettingsDialog/SettingsDialog.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    user: ownProps.predef ? ownProps.predef : state.user,
    redirectHome: ownProps.predef !== undefined,
  }
}

export default connect(mapStateToProps, { save_settings, close_dialog, start_sign_in, create_error, delete_error, save_settings_locally })(SettingsDialog)
