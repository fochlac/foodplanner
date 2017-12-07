import React from 'react';
import { connect } from 'react-redux';
import App from 'root/AppRoot.jsx';
import { initial_meals, initial_user, connect_serviceworker, convert_postmessage } from 'actions.js';

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app
});

export default connect(mapStateToProps, { initial_meals, initial_user, connect_serviceworker, convert_postmessage })(App);