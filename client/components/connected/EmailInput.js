import EmailInput from './EmailInput/EmailInput.jsx'
import React from 'react'
import { check_mail } from 'STORE/actions.js'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    app: state.app,
    user: state.user,
  }
}

export default connect(mapStateToProps, { check_mail })(EmailInput)
