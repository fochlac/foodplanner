import { close_dialog, datefinderAddDate } from 'STORE/actions.js'

import AddDateDialog from 'UI/AddDateDialog/AddDateDialog'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  }
}

export default connect(mapStateToProps, { close_dialog, datefinderAddDate })(AddDateDialog)
