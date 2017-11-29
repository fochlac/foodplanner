import React from 'react';
import { connect } from 'react-redux';
import Topbar from './Topbar/Topbar.jsx';
import {create_settings_dialog, create_meal_dialog, sign_out } from '../actions.js';

const mapStateToProps = (state, ownProps) => ({
	app: state.app,
	user: state.user
});

export default connect(mapStateToProps, {create_settings_dialog, create_meal_dialog, sign_out })(Topbar);