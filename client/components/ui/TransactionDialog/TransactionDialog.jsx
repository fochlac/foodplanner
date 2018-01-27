import React from 'react';
import Dialog from 'UI/Dialog.js';
import Pager from 'UI/Pager/Pager.jsx';
import { formatDate } from 'SCRIPTS/date.js';
import './TransactionDialog.less';

export default class TransactionDialog extends React.Component {
  constructor(props) {
    super();
  }

  componentDidMount() {
    this.props.get_transaction_history(this.props.user.id);
  }

  cancel() {
    this.props.close_dialog();
  }

  renderWrapper(children) {
    return (
      <table className="textAlignCenter transactions">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Mahlzeit</th>
            <th>Partner</th>
            <th>Betrag</th>
            <th>Summe</th>
          </tr>
        </thead>
        <tbody>
          {
            children
          }
        </tbody>
      </table>
    );
  }

  render() {
    let total = 0;

    return (
      <Dialog closeOnBackdrop={true} className="transactionDialog">
        <div className="titlebar">
          <h3>Transaktionshistorie</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          {
            this.props.transactions.length
            ? <Pager wrapper={this.renderWrapper} size={10} bottom={true} >
              {
                this.props.transactions.sort((a,b) => b.time - a.time).map((transaction, index) => {
                  total += transaction.diff;

                  return (
                    <tr key={index}>
                      <td>{formatDate(transaction.time)}</td>
                      <td>{transaction.reason}</td>
                      <td data-type="Partner:" >{transaction.user}</td>
                      <td data-type="Betrag:" className={(+transaction.diff < 0 )? 'negative' : ''}>{transaction.diff.toFixed(2)}</td>
                      <td className={(total < 0 )? 'negative' : ''}>{total.toFixed(2)}</td>
                    </tr>
                  )
                })
              }
            </Pager>
            : <p>Noch keine Transaktionen vorhanden.</p>
          }
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>Schließen</button>
        </div>
      </Dialog>
    );
  }
}