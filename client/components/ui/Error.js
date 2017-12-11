import React from 'react';
import { connect } from 'react-redux';
import Error from 'UI/Error/Error.jsx';
import { delete_error } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return {
    	error: state.app.errors[ownProps.id],
    	id: ownProps.id
    };
};

export default connect(mapStateToProps, { delete_error })(Error);