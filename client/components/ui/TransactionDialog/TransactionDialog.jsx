import React from 'react';
import Dialog from 'UI/Dialog.js';
import { formatDate } from 'SCRIPTS/date.js';
import './TransactionDialog.less';

export default class TransactionDialog extends React.Component {
  constructor(props) {
    super();
  }

  cancel() {
    this.props.close_dialog();
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
            ? <table className="textAlignCenter transactions">
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
                  this.props.transactions.sort((a,b) => a.time - b.time).map((transaction, index) => {
                    total += transaction.diff;

                    return (
                      <tr key={index}>
                        <td>{formatDate(transaction.time)}</td>
                        <td>{transaction.reason}</td>
                        <td>{transaction.user}</td>
                        <td className={(+transaction.diff < 0 )? 'negative' : ''}>{transaction.diff.toFixed(2)}</td>
                        <td className={(total < 0 )? 'negative' : ''}>{total.toFixed(2)}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
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