import './AdministrationPage.less'

import DefaultPage from 'UI/DefaultPage.js'
import GeneralAdministration from './GeneralAdministration'
import InstanceAdministration from './InstanceAdministration.jsx'
import TransactionAdministration from './TransactionAdministration.jsx'
import UserAdministration from './UserAdministration.jsx'
import React from 'react'

const wording = {
  general: 'Allgemeines',
  users: 'Benutzer',
  transactions: 'Transaktionen',
  instance: 'Konto',
}

export default class AdministrationPage extends React.Component {
  constructor(props) {
    super()

    this.state = {
      settings: 'general',
    }
  }

  componentDidMount() {
    this.props.loadInstance(this.props.user.instance)
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  handleFilter(type) {
    return () => {
      this.setState({ settings: type })

      switch (type) {
        case 'users':
          this.props.loadAllUsers(this.props.user.instance)
          break
        case 'transactions':
          this.props.loadAllTransactions(this.props.user.instance)
          break
      }
    }
  }

  render() {
    const { app, user, sign_out, instance, setAdmin, deleteUser } = this.props
    const { settings } = this.state

    return (
      <DefaultPage>
        <div className="topbar">
          <div className="spacer">
            <span>
              <span className={'instanceIcon fa fa-lg ' + instance.icon} />
            </span>
            <h3>{instance.title}</h3>
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
          <div className="content">
            <div className="filters">
              <ul className="filterList">
                <li className={'filter' + (settings === 'general' ? ' selected' : '')} onClick={this.handleFilter('general')}>
                  {wording.general}
                </li>
                <li className={'filter' + (settings === 'users' ? ' selected' : '')} onClick={this.handleFilter('users')}>
                  {wording.users}
                </li>
                <li className={'filter' + (settings === 'transactions' ? ' selected' : '')} onClick={this.handleFilter('transactions')}>
                  {wording.transactions}
                </li>
                <li className={'filter' + (settings === 'instance' ? ' selected' : '')} onClick={this.handleFilter('instance')}>
                  {wording.instance}
                </li>
              </ul>
            </div>
            {(() => {
              switch (this.state.settings) {
                case 'general':
                  return <GeneralAdministration instance={instance} />
                case 'users':
                  return <UserAdministration users={instance.users} self={user.id} setAdmin={setAdmin} deleteUser={deleteUser} />
                case 'transactions':
                  return <TransactionAdministration transactions={instance.transactions} />
                case 'instance':
                  return <InstanceAdministration instance={instance} />
              }
            })()}
          </div>
        </div>
      </DefaultPage>
    )
  }
}
