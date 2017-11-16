import React from 'react';
import { connect } from 'react-redux';
import SettingsDialog from './SettingsDialog/SettingsDialog.jsx';
import { save_settings, close_dialog, check_mail, select_mail, select_suggestion } from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    return {
        app: state.app,
        user: state.user
    }
};

export default connect(mapStateToProps, { save_settings, close_dialog, check_mail, select_mail, select_suggestion })(SettingsDialog);