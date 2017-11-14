import React from 'react';
import { connect } from 'react-redux';
import Topbar from './Topbar/Topbar.jsx';
import {start_login, logout} from '../actions.js';

const mapStateToProps = (state, ownProps) => ({
  user: state.users[state.user.id],
  logging: state.user.changing
});

export default connect(mapStateToProps, {start_login, logout})(Topbar);