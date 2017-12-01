import React from 'react';
import Dialog from '../Dialog.js';
import './PriceDialog.less';

export default class PriceDialog extends React.Component {
  constructor(props) {
    super();

    this.state = {
      options: {}
    }

    this.handlePrice = this.handlePrice.bind(this);
  }

  submit() {
    this.props.submit_prices(Object.values(this.state.options));
  }

  cancel() {
    this.props.close_dialog();
  }

  finalize() {
    this.props.close_dialog();
  }

  handlePrice(table, id) {
    return (evt) => {
      this.setState({options: {...this.state.options, [table + '_' + id]: {id, db: table, price: evt.target.value}}});
    }
  }

  renderRow(option) {
    if (option.type === "toggle") {
      return (
          <tr key={'opt_' + option.id}>
            <td><b>{option.name}</b></td>
            <td>
              <div className="row">
                <input type="number" step="0.1" defaultValue={option.price ? option.price : 0} onChange={this.handlePrice('mealOptions', option.id)} />
                <span className="moneySymbol">€</span>
              </div>
            </td>
          </tr>
        );
    } else if (option.type === 'value') {
      return (
        <tr key={'val' + option.id}>
          <td>{option.name}</td>
          <td>
            <div className="row">
              <input type="number" step="0.1" defaultValue={option.price ? option.price : 0} onChange={this.handlePrice('mealOptionValues', option.id)} />
              <span className="moneySymbol">€</span>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={'opt_' + option.id}><td colSpan="2"><b>{option.name}:</b></td></tr>
    );

  }

  render() {
    const m = this.props.meal;

    let tablerows = m.options.reduce((acc, option) => {
      acc.push(option);
      if (option.type !== "toggle") {
        option.values.forEach(val => acc.push(Object.assign({}, val, {type: 'value'})));
      }
      return acc;
    }, []);

    return (
      <Dialog>
        <div className="titlebar">
          <h3>Preise für Angebot: {m.name}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          <div>
            <label htmlFor="PriceDialog_meal" className="inlineBlock">Basispreis</label>
            <div className="row">
              <input type="number" step="0.1" id="PriceDialog_meal" defaultValue={m.price ? m.price : 0} onChange={this.handlePrice('meals', m.id)} />
              <span className="moneySymbol">€</span>
            </div>
          </div>
          <h4 className="subtitle_option">Optionspreise:</h4>
          <table>
            <tbody>
              {
                tablerows.map(this.renderRow.bind(this))
              }
            </tbody>
          </table>
        </div>
        <div className="foot">
          <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button type="button" onClick={this.submit.bind(this)}>Speichern</button>
          <button type="button" className="red" onClick={this.finalize.bind(this)}>Preise finalisieren</button>
        </div>
      </Dialog>
    );
  }
}