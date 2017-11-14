import React from 'react';
import { connect } from 'react-redux';
import Meal from './Meal/Meal.jsx';
import {start_meal_signup, meal_cancel, start_meal_edit} from '../actions.js';

const mapStateToProps = (state, ownProps) => ({
  user: state.users[state.user.id],
  meal: state.meals[ownProps.id],
  signups: state.signups,
  users: state.users
});

export default connect(mapStateToProps, {start_meal_signup, meal_cancel, start_meal_edit})(Meal);