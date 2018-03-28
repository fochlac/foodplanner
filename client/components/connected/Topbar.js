import { create_meal_dialog, create_settings_dialog, sign_out, start_sign_in } from 'STORE/actions.js'

import React from 'react'
import Topbar from './Topbar/Topbar.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  app: state.app,
  user: state.user,
  instance: state.instance,
})

export default connect(mapStateToProps, { create_settings_dialog, create_meal_dialog, sign_out, start_sign_in })(Topbar)
