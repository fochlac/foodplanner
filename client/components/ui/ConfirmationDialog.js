import React from 'react';
import { connect } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialog/ConfirmationDialog.jsx';
import { cancel_meal, close_dialog } from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, { cancel_meal, close_dialog })(ConfirmationDialog);