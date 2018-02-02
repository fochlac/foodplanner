import { close_dialog, regiser, sign_in } from 'ACTIONS';

import LoginDialog from 'UI/LoginDialog/LoginDialog.jsx';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, { sign_in, regiser, close_dialog})(LoginDialog);
