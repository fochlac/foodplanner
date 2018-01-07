import React from 'react';
import { connect } from 'react-redux';
import CreateMealDialog from 'UI/CreateMealDialog/CreateMealDialog.jsx';
import { create_meal, edit_meal, close_dialog } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    const edit = ownProps.type === 'edit',
    	meal = (ownProps.id !== undefined) ? state.meals.filter(meal => meal.id === ownProps.id)[0] : {};

    return {
    	invalid: !meal,
        app: state.app,
        user: state.user,
        meal: meal ? meal : {},
        meals: state.meals,
        edit
    };
};

export default connect(mapStateToProps, { create_meal, edit_meal, close_dialog })(CreateMealDialog);