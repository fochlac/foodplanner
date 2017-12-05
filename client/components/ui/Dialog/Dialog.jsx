import React from 'react';
import './Dialog.less';


export default class Dialog extends React.Component {
    constructor(props) {
        super();
    }

    closeDialog(evt) {
        if (evt.target.classList.contains('dialogBackground') && this.props.closeOnBackdrop) {
            this.props.close_dialog();
        }
    }

    render() {
        return (
            <div className="dialogBackground" onClick={this.closeDialog.bind(this)}>
                <div className={this.props.className ? this.props.className + ' dialog' : 'dialog'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}