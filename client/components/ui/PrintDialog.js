import React from 'react';
import { connect } from 'react-redux';
import PrintDialog from 'UI/PrintDialog/PrintDialog.jsx';
import { close_dialog, meal_set_print } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return {
    	meals: state.meals,
    	...ownProps
    };
};

export default connect(mapStateToProps, { close_dialog, meal_set_print })(PrintDialog);