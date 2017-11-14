import DefaultPage from './DefaultPage/DefaultPage.jsx'
import React from 'react'
import { connect } from 'react-redux'
import { show_impressum } from 'STORE/actions.js'

const mapStateToProps = (state, ownProps) => ({
  app: state.app,
  errors: state.app.errors,
})

export default connect(mapStateToProps, { show_impressum })(DefaultPage)
