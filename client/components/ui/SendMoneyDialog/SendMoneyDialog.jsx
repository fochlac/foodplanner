import React from 'react';
import Dialog from 'UI/Dialog.js';
import EmailInput from 'UI/EmailInput.js';
import { formatDate } from 'SCRIPTS/date.js';

export default class SendMoneyDialog extends React.Component {
  constructor(props) {
    super();
    this.state = {
        amount: 0
    }

    this.amountInput = this.handleInput('amount').bind(this);
  }

  cancel() {
    this.props.close_dialog();
  }

  submit() {
    if (!(this.props.app.mailSuggestion && this.props.app.mailSuggestion.id && this.props.app.mailSuggestion.id !== this.props.user.id) || !this.state.amount) {
      return;
    }

    this.props.send_money({
        source: this.props.user.id,
        target: this.props.app.mailSuggestion.id,
        amount: this.state.amount
    });
  }

  handleInput(field) {
      return (evt) => {
          this.setState({
              [field]: evt.target.value
          });
      };
  }

  render() {
    let total = 0;

    return (
      <Dialog closeOnBackdrop={true} className="sendMoneyDialog">
        <div className="titlebar">
          <h3>Geld senden</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          <label htmlFor="SendMoneyDialog_mail">E-Mail</label>
          <EmailInput id="SendMoneyDialog_mail" />
          <label htmlFor="SendMoneyDialog_amount">Betrag</label>
          <div className="row">
            <input type="number" id="SendMoneyDialog_amount" onChange={this.amountInput}/>
            <span className="moneySymbol marginLeft">€</span>
          </div>
        </div>
        <div className="foot">
          <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button type="button" className="red" onClick={this.submit.bind(this)}>Senden</button>
        </div>
      </Dialog>
    );
  }
}