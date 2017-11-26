import React from 'react';
import { connect } from 'react-redux';
import Dialog from './Dialog/Dialog.jsx';
import { close_dialog } from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, { close_dialog })(Dialog);