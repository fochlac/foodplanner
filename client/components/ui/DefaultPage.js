import { show_impressum } from 'STORE/actions.js'

import DefaultPage from 'UI/DefaultPage/DefaultPage.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  dialog: ownProps.dialog,
  app: state.app,
  errors: state.app.errors,
})

export default connect(mapStateToProps, { show_impressum })(DefaultPage)
