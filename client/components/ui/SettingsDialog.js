import React from 'react';
import { connect } from 'react-redux';
import SettingsDialog from 'UI/SettingsDialog/SettingsDialog.jsx';
import { save_settings, close_dialog } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return {
        app: state.app,
        user: ownProps.predef ? ownProps.predef : state.user,
        redirectHome: (ownProps.predef !== undefined)
    }
};

export default connect(mapStateToProps, { save_settings, close_dialog })(SettingsDialog);