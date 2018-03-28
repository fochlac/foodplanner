import ImpressumDialog from './ImpressumDialog/ImpressumDialog.jsx'
import React from 'react'
import { close_dialog } from 'STORE/actions.js'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return ownProps
}

export default connect(mapStateToProps, { close_dialog })(ImpressumDialog)
