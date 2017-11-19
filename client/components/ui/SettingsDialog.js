import React from 'react';
import { connect } from 'react-redux';
import SettingsDialog from './SettingsDialog/SettingsDialog.jsx';
import { save_settings, close_dialog, check_mail, select_mail, select_suggestion, hide_mail_suggestion } from '../actions.js';

const mapStateToProps = (state, ownProps) => {
    return {
        app: state.app,
        user: ownProps.predef ? ownProps.predef : state.user,
        redirectHome: (ownProps.predef !== undefined)
    }
};

export default connect(mapStateToProps, { save_settings, close_dialog, check_mail, select_mail, select_suggestion, hide_mail_suggestion })(SettingsDialog);