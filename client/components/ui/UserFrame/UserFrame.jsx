import './UserFrame.less'

import React from 'react'

export default class UserFrame extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    const u = this.props.user


    return (u.id) ? (
      <div className="userFrame">
        <span>
          <span>
            <span>
              <div className="userDescription">Angemeldet als:</div>
              <div className="userName">{u.name}</div>
            </span>
            {u.admin ? <div className="role">Administrator</div> : null}
          </span>
          <div className="balance noWrap">
            <span>Guthaben: </span>
            <b>{u.balance ? u.balance.toFixed(2) : 0.0}</b>
            <span className="moneySymbol">€</span>
          </div>
        </span>
        <span>
          <div className="fakeLink historyLink" onClick={this.props.show_transaction_history.bind(this, u.id)}>
            Kontoauszug
          </div>
          <div className="fakeLink userManagementLink noWrap" onClick={this.props.start_send_money.bind(this)}>
            Geld senden
          </div>
        </span>
      </div>
    ) : {

    }
  }
}
