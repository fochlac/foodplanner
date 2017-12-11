import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'UI/Dialog/Dialog.jsx';
import { close_dialog } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        app: state.app
    };
};

export default connect(mapStateToProps, { close_dialog })(Dialog);