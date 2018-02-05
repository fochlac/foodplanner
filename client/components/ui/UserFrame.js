import { show_transaction_history, start_send_money } from 'ACTIONS';

import React from 'react';
import UserFrame from 'UI/UserFrame/UserFrame.jsx';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {

    return {
        user: state.user
    };
};

export default connect(mapStateToProps, { show_transaction_history, start_send_money })(UserFrame);
