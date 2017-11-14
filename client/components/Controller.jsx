import React from 'react';
import { connect } from 'react-redux';
import App from './root/AppRoot.jsx';
import {initial_signups, initial_meals} from './actions.js';

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app
});

export default connect(mapStateToProps, {initial_signups, initial_meals})(App);