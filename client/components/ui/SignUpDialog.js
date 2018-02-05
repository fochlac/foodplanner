import { close_dialog, meal_edit, meal_signup, start_sign_in } from 'ACTIONS';

import React from 'react';
import SignUpDialog from 'UI/SignUpDialog/SignUpDialog.jsx';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    const edit = ownProps.type === 'edit';

    if (edit) {
        const signup = state.signups[ownProps.id] ? state.signups[ownProps.id] : undefined;

        if (!signup) {
            return {
                invalid: true
            };
        }

        return {
            edit: true,
            meal: state.meals.filter(meal => meal.id === signup.meal)[0],
            user: state.user,
            signup
        };
    } else {
        const meal = state.meals.filter(meal => meal.id === ownProps.id)[0];

        if (!meal) {
            return {
                invalid: true
            };
        }

        return {
            edit: false,
            meal,
            user: state.user,
            signedUp: !!meal.signups.map(id => state.signups[id]).find(signup => signup.userId === state.user.id)
        };
    }
};

export default connect(mapStateToProps, { meal_signup, meal_edit, close_dialog, start_sign_in })(SignUpDialog);
