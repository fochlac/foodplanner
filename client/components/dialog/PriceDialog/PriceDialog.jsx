import React from 'react'
import dEqual from 'fast-deep-equal'
import Dialog from 'DIALOG/Dialog.js'
import Payment from './Payment.jsx'
import Price from './Price.jsx'
import './PriceDialog.less'

const wording = {
  invalidId: 'Ungültiger Termin!',
  invalidIdExplanation: 'Dieser Termin ist leider nicht mehr verfügbar.',
  close: 'Schließen',
  prices: 'Preise für Angebot',
  requestPayment: 'Zahlungen anfordern',
  cancel: 'Abbrechen',
  save: 'Speichern',
  finalize: 'Preise finalisieren',
}

export default class PriceDialog extends React.Component {
  constructor(props) {
    super()

    this.state = {
      options: {},
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!dEqual(nextProps.meal, this.props.meal) || !dEqual(nextProps.signups, this.props.signups)) {
      return true
    }
    return false
  }

  submit() {
    this.props.submit_prices(Object.values(this.state.options), this.props.meal.id)
  }

  setPrices(options) {
    this.setState({ options })
  }

  cancel() {
    this.props.close_dialog()
  }

  finalize() {
    this.props.start_payment(Object.values(this.state.options), this.props.meal.id)
  }

  render() {
    const m = this.props.meal

    if (this.props.invalid) {
      return (
        <Dialog className="SignUpDialog">
          <div className="titlebar">
            <h3>{wording.invalidId}</h3>
            <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
          </div>
          <div className="body">
            <p>{wording.invalidIdExplanation}</p>
          </div>
          <div className="foot">
            <button type="button" className="cancel" onClick={this.cancel.bind(this)}>
              {wording.close}
            </button>
          </div>
        </Dialog>
      )
    }

    return (
      <Dialog className="PriceDialog">
        <div className="titlebar">
          <h3>
            {wording.prices}: {m.name}
          </h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body PriceDialog">
          {m.locked ? (
            <Payment signups={this.props.signups} toggle_paid={this.props.toggle_paid.bind(this)} />
          ) : (
            <Price meal={m} price_options={this.setPrices.bind(this)} />
          )}
        </div>
        <div className="foot">
          {m.locked ? (
            <span>
              {Date.now() > m.deadline ? (
                <button type="button" className="red finalize" onClick={this.finalize.bind(this)}>
                  {wording.requestPayment}
                </button>
              ) : null}
              <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
                {wording.close}
              </button>
            </span>
          ) : (
            <span>
              <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
                {wording.cancel}
              </button>
              <button className="submit" type="button" onClick={this.submit.bind(this)}>
                {wording.save}
              </button>
              <button type="button" className="finalize red" onClick={this.finalize.bind(this)}>
                {wording.finalize}
              </button>
            </span>
          )}
        </div>
      </Dialog>
    )
  }
}
