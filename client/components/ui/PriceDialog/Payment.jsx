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
                      <td>{signup.name}</td>
                      <td className="noWrap">{signup.price.toFixed(2)}<span className="moneySymbol">€</span></td>
                      <td className="pointer" onClick={() => this.props.toggle_paid(signup.id, !signup.paid)}><span className={'fa fa-lg ' + (signup.paid ? 'fa-check' : 'fa-times')}></span></td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
        </div>
    );
  }
}