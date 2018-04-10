import React from 'react'
import UserSearch from './UserSearch/UserSearch.jsx'
import { connect } from 'react-redux'
import { searchUser } from 'STORE/actions.js'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    app: state.app,
    user: state.user,
  }
}

export default connect(mapStateToProps, { searchUser })(UserSearch)
