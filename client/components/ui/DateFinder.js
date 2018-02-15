import {} from 'STORE/actions.js'

import DateFinder from 'UI/DateFinder/DateFinder.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  datefinder: ownProps.id ? state.datefinder.find(datefinder => datefinder.id === ownProps.id) : undefined,
})

export default connect(mapStateToProps, {})(DateFinder)
