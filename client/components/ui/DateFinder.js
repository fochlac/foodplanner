import { refresh, show_impressum } from 'STORE/actions.js'

import DateFinder from 'UI/DateFinder/DateFinder.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  datefinder: ownProps.id ? state.datefinder[ownProps.id] : undefined,
})

export default connect(mapStateToProps, { show_impressum, refresh })(DateFinder)
