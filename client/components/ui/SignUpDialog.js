import React from 'react';
import { connect } from 'react-redux';
import SignUpDialog from './SignUpDialog/SignUpDialog.jsx';
import {meal_signup, meal_edit, close_dialog} from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    const edit = ownProps.type === 'edit';

    if (edit) {
        const signup = state.signups[ownProps.id];
        return {
            edit: true,
            signup,
            meal: state.meals.filter(meal => meal.id === ownProps.id)[0]
        };
    } else {
        const meal = state.meals.filter(meal => meal.id === ownProps.id)[0];
        return {
            edit: false,
            meal,
            user: state.user
        };
    }


};

export default connect(mapStateToProps, {meal_signup, meal_edit, close_dialog})(SignUpDialog);