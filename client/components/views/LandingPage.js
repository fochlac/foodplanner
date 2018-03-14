import {} from 'STORE/actions.js'

import LandingPage from 'PAGES/LandingPage/LandingPage.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    app: state.app,
    instance: state.instance,
  }
}

export default connect(mapStateToProps, {})(LandingPage)
