import React from 'react';
import { connect } from 'react-redux';
import Topbar from './Topbar/Topbar.jsx';
import {create_settings_dialog, create_meal_dialog} from '../actions.js';

const mapStateToProps = (state, ownProps) => ({
	state: state
});

export default connect(mapStateToProps, {create_settings_dialog, create_meal_dialog})(Topbar);