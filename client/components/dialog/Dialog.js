import Dialog from './Dialog/Dialog.jsx'
import React from 'react'
import { close_dialog } from 'STORE/actions.js'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    app: state.app,
  }
}

export default connect(mapStateToProps, { close_dialog })(Dialog)
