import React from 'react';
import { connect } from 'react-redux';
import SignUpDialog from 'UI/SignUpDialog/SignUpDialog.jsx';
import {meal_signup, meal_edit, close_dialog } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    const edit = ownProps.type === 'edit';

    if (edit) {
        const signup = state.signups[ownProps.id];
        return {
            edit: true,
            signup,
            user: state.user,
            meal: state.meals.filter(meal => meal.id === signup.meal)[0]
        };
    } else {
        const meal = state.meals.filter(meal => meal.id === ownProps.id)[0];
        return {
            edit: false,
            meal,
            signedUp: !!meal.signups.map(id => state.signups[id]).find(signup => signup.userId === state.user.id),
            user: state.user
        };
    }


};

export default connect(mapStateToProps, {meal_signup, meal_edit, close_dialog })(SignUpDialog);