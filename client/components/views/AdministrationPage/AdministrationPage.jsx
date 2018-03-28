import './AdministrationPage.less'

import DefaultPage from 'CONNECTED/DefaultPage.js'
import GeneralAdministration from './GeneralAdministration'
import InstanceAdministration from './InstanceAdministration.jsx'
import React from 'react'
import TransactionAdministration from './TransactionAdministration.jsx'
import UserAdministration from './UserAdministration.jsx'

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
    const { app, user, sign_out, instance, setAdmin, deleteUser, validateGmail, saveGmail, saveInstanceData } = this.props
    const { settings } = this.state

    const userActions = { setAdmin, deleteUser }
    const generalActions = { validateGmail, saveGmail, saveInstanceData }
    const instanceActions = { saveInstanceData }

    return (
      <DefaultPage>
        <div className="topbar">
          <div className="spacer">
            <span className="pointer noWrap flexCenter" onClick={() => window.location.href = (instance.subdomain ? ('https://' + instance.subdomain + '.fochlac.com/') : (instance.root + '/' + instance.id))} >
              <span className={'instanceIcon fa fa-lg ' + instance.icon} />
              <b className="font12">{instance.title}</b>
            </span>
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
        <div className="dashboard landing admin">
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
            {instance.id &&
              (() => {
                switch (this.state.settings) {
                  case 'general':
                    return <GeneralAdministration instance={instance} app={app} {...generalActions} />
                  case 'users':
                    return <UserAdministration users={instance.users} self={user.id} {...userActions} />
                  case 'transactions':
                    return <TransactionAdministration transactions={instance.transactions} />
                  case 'instance':
                    return <InstanceAdministration instance={instance} {...instanceActions} />
                }
              })()}
          </div>
        </div>
      </DefaultPage>
    )
  }
}
