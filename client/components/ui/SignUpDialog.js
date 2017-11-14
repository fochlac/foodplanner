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
            user: state.users[signup.user],
            meal: state.meals[signup.meal]
        };
    } else {
        const meal = state.meals[ownProps.id];
        return {
            edit: false,
            meal,
            user: state.users[state.user.id]
        };
    }


};

export default connect(mapStateToProps, {meal_signup, meal_edit, close_dialog})(SignUpDialog);