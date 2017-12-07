import React from 'react';
import { connect } from 'react-redux';
import TransactionDialog from 'UI/TransactionDialog/TransactionDialog.jsx';
import { close_dialog} from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {

    return {
    	user: state.user,
    	transactions: state.user.transactions ? state.user.transactions : []
    };
};

export default connect(mapStateToProps, { close_dialog })(TransactionDialog);