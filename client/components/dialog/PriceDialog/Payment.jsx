import React from 'react'

export default class Payment extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    const { signups, toggle_paid } = this.props
    //const sameMeal = signups.every((signup, index) => signup.id === signups[Math.min(0, index - 1)].id)
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
            {signups.map((signup, index) => (
              <tr key={index}>
                <td className="name">
                  {signup.name}
                  {signup.userId ? (
                    <span className="fa fa-check-circle-o col_green marginLeft" />
                  ) : (
                    <span className="fa fa-question-circle-o col_red marginLeft" />
                  )}
                </td>
                <td className="noWrap price">
                  {signup.price ? signup.price.toFixed(2) : 'unbekannt'}
                  <span className="moneySymbol">€</span>
                </td>
                <td className="pointer state" onClick={() => toggle_paid(signup.id, !signup.paid)}>
                  <span className={'fa fa-lg ' + (signup.paid ? 'fa-check' : 'fa-times')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
