import React from 'react';
import { connect } from 'react-redux';
import Dashboard from './dashboard/Dashboard.jsx';
import {} from '../actions.js';

const mapStateToProps = (state, ownProps) => ({
  meals: state.meals
});

export default connect(mapStateToProps, {})(Dashboard);