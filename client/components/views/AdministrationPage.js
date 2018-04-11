import {
  activateUser,
  deactivateUser,
  loadAllTransactions,
  loadAllUsers,
  loadInstance,
  saveGmail,
  saveInstanceData,
  setAdmin,
  sign_out,
  validateGmail,
} from 'STORE/actions.js'

import AdministrationPage from 'PAGES/AdministrationPage/AdministrationPage.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    app: state.app,
    user: state.user,
    instance: state.instance,
  }
}

export default connect(mapStateToProps, {
  sign_out,
  loadAllUsers,
  loadAllTransactions,
  setAdmin,
  activateUser,
  deactivateUser,
  loadInstance,
  validateGmail,
  saveGmail,
  saveInstanceData,
})(AdministrationPage)
