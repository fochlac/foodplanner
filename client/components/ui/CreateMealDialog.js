import React from 'react';
import { connect } from 'react-redux';
import CreateMealDialog from './CreateMealDialog/CreateMealDialog.jsx';
import {meal_signup, create_meal, edit_meal, close_dialog} from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    const edit = ownProps.type === 'edit';

    return {
        user: state.user,
        meal: (ownProps.id !== undefined) ? state.meals.filter(meal => meal.id === ownProps.id)[0] : {},
        meals: state.meals,
        edit
    };


};

export default connect(mapStateToProps, {meal_signup, create_meal, edit_meal, close_dialog})(CreateMealDialog);