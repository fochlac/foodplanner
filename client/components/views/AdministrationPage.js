import { sign_out, loadAllUsers, loadAllTransactions, setAdmin, deleteUser, loadInstance } from 'STORE/actions.js'

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
  deleteUser,
  loadInstance,
})(AdministrationPage)
