import React from 'react';
import { connect } from 'react-redux';
import DefaultPage from 'ROOT/DefaultPage.jsx';
import { show_impressum, initial_meals } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => ({
  dialog: ownProps.dialog,
  app: state.app,
  errors: state.app.errors
});

export default connect(mapStateToProps, { show_impressum, initial_meals })(DefaultPage);