import React from 'react';
import dEqual from 'deep-equals';
import Dialog from 'UI/Dialog.js';
import Payment from './Payment.jsx';
import Price from './Price.jsx';
import './PriceDialog.less';

export default class PriceDialog extends React.Component {
  constructor(props) {
    super();

    this.state = {
      options: {}
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !dEqual(nextProps.meal, this.props.meal)
      || !dEqual(nextProps.signups, this.props.signups)
    ) {
      return true;
    }
    return false;
  }

  submit() {
    this.props.submit_prices(Object.values(this.state.options), this.props.meal.id);
  }

  setPrices(options) {
    this.setState({options});
  }

  cancel() {
    this.props.close_dialog();
  }

  finalize() {
    this.props.start_payment(Object.values(this.state.options), this.props.meal.id);
  }

  render() {
    const m = this.props.meal;
    return (
      <Dialog>
        <div className="titlebar">
          <h3>Preise für Angebot: {m.name}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body PriceDialog">
         {
          m.locked
          ? <Payment signups={this.props.signups} toggle_paid={this.props.toggle_paid.bind(this)} />
          : <Price meal={m} price_options={this.setPrices.bind(this)} />
         }
        </div>
        <div className="foot">
          {
            m.locked
            ? <button type="button" onClick={this.cancel.bind(this)}>Schließen</button>
            : <span>
              <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
              <button type="button" onClick={this.submit.bind(this)}>Speichern</button>
              <button type="button" className="red" onClick={this.finalize.bind(this)}>Preise finalisieren</button>
            </span>
          }
        </div>
      </Dialog>
    );
  }
}