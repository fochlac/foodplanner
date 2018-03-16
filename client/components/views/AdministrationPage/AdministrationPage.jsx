import './AdministrationPage.less'

import DefaultPage from 'UI/DefaultPage.js'
import React from 'react'

const wording = {
  general: 'Allgemeines',
  users: 'Nutzerverwaltung',
  transactions: 'Transaktionen',
  instance: 'Anmeldungsdaten',
}

export default class AdministrationPage extends React.Component {
  constructor(props) {
    super()

    this.state = {
      settings: 'general',
    }
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  render() {
    const { app, user, sign_out } = this.props

    return (
      <DefaultPage>
        <div className="topbar">
          <div className="spacer">
            <span className="fa fa-calender fa-lg" />
            <ul className="quicklinks">
              {app.hiddenBusy && app.dialog === '' ? (
                <li>
                  <span className="fa fa-refresh fa-spin fa-lg" />
                </li>
              ) : null}
              <li onClick={sign_out.bind(this, user.id)}>
                <span className="symbolExplanation">Abmelden</span>
                <span className="fa fa-sign-out fa-lg" title="Abmelden" />
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard landing">
          <div className="filters">
            <ul className="filterList">
              <li className="filter selected" onClick={() => this.setState({ settings: 'general' })}>
                {wording.general}
              </li>
              <li className="filter" onClick={() => this.setState({ settings: 'users' })}>
                {wording.users}
              </li>
              <li className="filter" onClick={() => this.setState({ settings: 'transactions' })}>
                {wording.transactions}
              </li>
              <li className="filter" onClick={() => this.setState({ settings: 'instance' })}>
                {wording.instance}
              </li>
            </ul>
          </div>
          <div className="content">
            {() => {
              switch (this.state.settings) {
                case 'general':
                  return this.renderGeneral()
                case 'users':
                  return this.renderUsers()
                case 'transactions':
                  return this.renderTransactions()
                case 'instance':
                  return this.renderInstance()
              }
            }}
          </div>
        </div>
      </DefaultPage>
    )
  }

  renderGeneral() {
    return <div>general</div>
  }

  renderUsers() {
    return <div>Users</div>
  }

  renderTransactions() {
    return <div>transactions</div>
  }

  renderInstance() {
    return <div>instance</div>
  }
}
