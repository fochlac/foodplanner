import { datefinderFinalize, datefinderToggleDate } from 'STORE/actions.js'

import DateFinder from 'UI/DateFinder/DateFinder.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const datefinder = ownProps.id ? state.datefinder.find(datefinder => datefinder.id === ownProps.id) : undefined

  return {
    user: state.user,
    datefinder,
    edit: datefinder && state.user.id === datefinder.creator,
  }
}

export default connect(mapStateToProps, { datefinderToggleDate, datefinderFinalize })(DateFinder)
