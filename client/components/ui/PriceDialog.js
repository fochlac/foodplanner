import React from 'react';
import { connect } from 'react-redux';
import PriceDialog from './PriceDialog/PriceDialog.jsx';
import { close_dialog, submit_prices } from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    return {
        meal: state.meals.find(meal => meal.id === ownProps.id)
    };
};

export default connect(mapStateToProps, { close_dialog, submit_prices })(PriceDialog);