import React from 'react';
import Dialog from 'UI/Dialog.js';

export default class ConfirmationDialog extends React.Component {
  constructor(props) {
    super();
  }

  submit() {
    this.props[this.props.action](...this.props.parameter);
  }

  cancel() {
    this.props.close_dialog();
  }

  render() {
    return (
      <Dialog className="confirmationDialog" closeOnBackdrop={true}>
        <div className="titlebar">
          <h3>{this.props.title ? this.props.title : 'Bestätigung'}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          <p>{this.props.message}</p>
        </div>
        <div className="foot">
          {
            !this.props.noCancel
            ? <button type="button" className="cancel" onClick={this.cancel.bind(this)}>Abbrechen</button>
            : null
          }
          <button type="button" className="submit" onClick={this.submit.bind(this)}>Bestätigen</button>
        </div>
      </Dialog>
    );
  }
}