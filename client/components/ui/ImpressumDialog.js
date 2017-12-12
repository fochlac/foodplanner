import React from 'react';
import { connect } from 'react-redux';
import ImpressumDialog from 'UI/ImpressumDialog/ImpressumDialog.jsx';
import { close_dialog } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, { close_dialog })(ImpressumDialog);