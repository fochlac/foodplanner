import React from 'react';
import './Error.less';


export default class Error extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="error">
                <p>{this.props.error}</p>
                <span className="fa fa-times" onClick={this.props.delete_error.bind(this, this.props.id)}></span>
            </div>
        );
    }
}