import React from 'react';
import './Dialog.less';


export default class Dialog extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="dialogBackground">
                <div className={this.props.className ? this.props.className + ' dialog' : 'dialog'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}