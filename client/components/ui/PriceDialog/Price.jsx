import React from 'react';

const parsePrice = function(price) {
  return price ? (+price).toFixed(2) : (0).toFixed(2);
}

export default class Prices extends React.Component {
  constructor(props) {
    super();

    this.state = {
      options: {}
    }

    this.handlePrice = this.handlePrice.bind(this);
  }

  handlePrice(table, id) {
    return (evt) => {
      const options = {...this.state.options, [table + '_' + id]: {id, db: table, price: evt.target.value}};

      this.setState({options});
      this.props.price_options(options);
    }
  }

  renderRow(option) {
    if (option.type === "toggle") {
      return (
          <tr key={'opt_' + option.id}>
            <td><b>{option.name}:</b></td>
            <td>
              <div className="row">
                <input type="number" step="0.1" defaultValue={parsePrice(option.price)} onChange={this.handlePrice('mealOptions', option.id)} />
                <span className="moneySymbol">€</span>
              </div>
            </td>
          </tr>
        );
    } else if (option.type === 'value') {
      return (
        <tr key={'val' + option.id}>
          <td>{option.name}:</td>
          <td>
            <div className="row">
              <input type="number" step="0.1" defaultValue={parsePrice(option.price)} onChange={this.handlePrice('mealOptionValues', option.id)} />
              <span className="moneySymbol">€</span>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={'opt_' + option.id}><td colSpan="2"><b>{option.name}</b></td></tr>
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
      <div className="body PriceDialog">
        <table>
          <tbody>
            <tr>
              <td><b>Basispreis:</b></td>
              <td>
                <div className="row">
                  <input type="number" step="0.1" id="PriceDialog_meal" defaultValue={parsePrice(m.price)} onChange={this.handlePrice('meals', m.id)} />
                  <span className="moneySymbol">€</span>
                </div>
              </td>
            </tr>
            {
              tablerows.map(this.renderRow.bind(this))
            }
          </tbody>
        </table>
      </div>
    );
  }
}