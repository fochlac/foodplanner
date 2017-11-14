import React from 'react';
import { connect } from 'react-redux';
import App from './root/AppRoot.jsx';
import {initial_signups} from './actions.js';

const mapStateToProps = (state, ownProps) => ({
  login: state.user.login,
  user: state.users[state.user.id],
  app: state.app
});

export default connect(mapStateToProps, {initial_signups})(App);