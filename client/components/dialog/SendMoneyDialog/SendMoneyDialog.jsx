import './SendMoneyDialog.less'

import Dialog from 'DIALOG/Dialog.js'
import React from 'react'
import UserSearch from 'CONNECTED/UserSearch.js'
import { formatDate } from 'UTILS/date.js'

const wording = {
  user: 'Benutzer',
  amount: 'Betrag',
  sendMoney: 'Geld senden',
  cancel: 'Abbrechen',
  submit: 'Senden',
}

export default class SendMoneyDialog extends React.Component {
  constructor(props) {
    super()
    this.state = {
      amount: 0,
      userId: null,
    }

    this.amountInput = this.handleInput('amount').bind(this)
  }

  cancel() {
    this.props.close_dialog()
  }

  submit() {
    if (!this.state.userId || !this.state.amount) {
      return
    }

    this.props.send_money({
      source: this.props.user.id,
      target: this.state.userId,
      amount: this.state.amount,
    })
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  render() {
    let total = 0

    return (
      <Dialog closeOnBackdrop={true} className="sendMoneyDialog">
        <div className="titlebar">
          <h3>{wording.sendMoney}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body">
          <label htmlFor="SendMoneyDialog_mail">{wording.user}</label>
          <UserSearch id="SendMoneyDialog_mail" onChange={val => this.setState({ userId: val })} />
          <label htmlFor="SendMoneyDialog_amount">{wording.amount}</label>
          <div className="row">
            <input type="number" id="SendMoneyDialog_amount" onChange={this.amountInput} />
            <span className="moneySymbol marginLeft">€</span>
          </div>
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
            {wording.cancel}
          </button>
          <button type="button" className="red submit" onClick={this.submit.bind(this)}>
            {wording.submit}
          </button>
        </div>
      </Dialog>
    )
  }
}
