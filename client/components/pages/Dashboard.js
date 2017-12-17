import React from 'react';
import { connect } from 'react-redux';
import Dashboard from 'PAGES/Dashboard/Dashboard.jsx';
import {} from 'ACTIONS';

let startOfDay = new Date().setHours(0,0,0);

const mapStateToProps = (state, ownProps) => ({
  app: state.app,
  meals: state.meals.filter(meal => meal.time > startOfDay).sort((a,b) => (a.time - b.time)),
  oldMeals: state.meals.filter(meal => meal.time < startOfDay).sort((a,b) => (b.time - a.time))
});

export default connect(mapStateToProps, {})(Dashboard);