import React from 'react';
import { connect } from 'react-redux';
import EmailInput from 'UI/EmailInput/EmailInput.jsx';
import { check_mail } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        app: state.app,
        user: state.user
    }
};

export default connect(mapStateToProps, { check_mail })(EmailInput);