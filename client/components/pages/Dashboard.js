import React from 'react';
import { connect } from 'react-redux';
import Dashboard from './dashboard/Dashboard.jsx';
import {} from '../actions.js';

let startOfDay = new Date().setHours(0,0,0);

const mapStateToProps = (state, ownProps) => ({
  meals: state.meals.filter(meal => meal.time > startOfDay).sort((a,b) => (a.time - b.time)),
  oldMeals: state.meals.filter(meal => meal.time < startOfDay).sort((a,b) => (b.time - a.time))
});

export default connect(mapStateToProps, {})(Dashboard);