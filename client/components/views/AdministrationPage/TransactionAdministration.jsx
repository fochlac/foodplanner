import React from 'react'
import Pager from 'RAW/Pager.jsx'
import { formatDate } from 'UTILS/date.js'

const wording = {
  date: 'Datum',
  name: 'Termin',
  payee: 'Zahlungs\u00ADempfänger',
  payer: 'Zahlungs\u00ADpflichtiger',
  amount: 'Betrag',
  empty: 'Noch keine Transaktionen vorhanden.',
}

export default class TransactionAdministration extends React.Component {
  constructor(props) {
    super()
  }

  renderWrapper(children) {
    return (
      <table className="textAlignCenter transactions">
        <thead>
          <tr>
            <th>{wording.date}</th>
            <th>{wording.name}</th>
            <th>{wording.payee}</th>
            <th>{wording.payer}</th>
            <th>{wording.amount}</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    )
  }

  render() {
    const {transactions} = this.props

    return <div>
        {transactions && transactions.length ? <Pager wrapper={this.renderWrapper} size={20} bottom={true}>
            {transactions.sort((a, b) => b.time - a.time).map(transaction => <tr key={transaction.id}>
                <td>{formatDate(transaction.time)}</td>
                <td>{transaction.reason}</td>
                <td data-type={wording.payee + ':'}>{transaction.target}</td>
                <td data-type={wording.payer + ':'}>{transaction.source}</td>
                <td data-type={wording.amount + ':'}> {transaction.amount.toFixed(2)}</td>
              </tr>)}
          </Pager> : <p className="textAlignCenter emptyMessage">{wording.empty}</p>}
      </div>
  }
}
