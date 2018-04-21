import {load_history, refresh} from 'STORE/actions.js'

import Dashboard from 'PAGES/Dashboard/Dashboard.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const oldMealIds = Array(state.app.historySize).fill().map((val, index) => state.historyMealMap[index])

  return {
    app: state.app,
    login: state.user.id,
    meals: state.meals,
    oldMealIds,
    debts: state.debts
  }
}

export default connect(mapStateToProps, {load_history, refresh})(Dashboard)
