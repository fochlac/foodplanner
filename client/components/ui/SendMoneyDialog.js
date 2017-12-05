import React from 'react';
import { connect } from 'react-redux';
import SendMoneyDialog from './SendMoneyDialog/SendMoneyDialog.jsx';
import { close_dialog, send_money } from '../actions.js';

const mapStateToProps = (state, ownProps) => {

    return {
    	user: state.user,
    	app: state.app
    };
};

export default connect(mapStateToProps, { close_dialog, send_money })(SendMoneyDialog);