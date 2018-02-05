import Error from 'UI/Error/Error.jsx'
import React from 'react'
import { connect } from 'react-redux'
import { delete_error } from 'STORE/actions.js'

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.app.errors[ownProps.id],
    id: ownProps.id,
  }
}

export default connect(mapStateToProps, { delete_error })(Error)
