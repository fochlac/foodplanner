import React from 'react';

export default class Payment extends React.Component {
  constructor(props) {
    super();
  }


  render() {
    return (
        <div className="body PriceDialog">
          <table>
            <thead className="paymentList">
              <tr>
                <th>Teilnehmer</th>
                <th>Preis</th>
                <th>Bezahlt</th>
              </tr>
            </thead>
            <tbody className="paymentList">
                {
                  this.props.signups.map((signup, index) => (
                    <tr key={index}>
                      <td className="name">{signup.name}</td>
                      <td className="noWrap price">{signup.price ? signup.price.toFixed(2) : 'unbekannt'}<span className="moneySymbol">€</span></td>
                      <td className="pointer state" onClick={() => this.props.toggle_paid(signup.id, !signup.paid)}><span className={'fa fa-lg ' + (signup.paid ? 'fa-check' : 'fa-times')}></span></td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
        </div>
    );
  }
}