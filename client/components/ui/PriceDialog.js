import React from 'react';
import { connect } from 'react-redux';
import PriceDialog from 'UI/PriceDialog/PriceDialog.jsx';
import { close_dialog, submit_prices, start_payment, toggle_paid } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    let meal = state.meals.find(meal => meal.id === ownProps.id);
    if (meal) {
        return {
            meal,
            signups: meal.signups.map(id => state.signups[id])
        };
    }
    return {
        invalid: true
    }
};

export default connect(mapStateToProps, { close_dialog, submit_prices, start_payment, toggle_paid })(PriceDialog);