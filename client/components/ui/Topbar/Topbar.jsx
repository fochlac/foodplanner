import './Topbar.less'

import { Link } from 'react-router-dom'
import React from 'react'

export default class Topbar extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    const { instance, app, user, create_meal_dialog, create_settings_dialog, sign_out, start_sign_in } = this.props

    return <div className="topbar">
        <div className="spacer">
          <span className={'fa fa-lg instanceIcon ' + instance.icon} />
          <h3 className="pointer" onClick={() => window.location.assign(instance.root)}>
            {instance.title}
          </h3>
          <ul className="quicklinks">
            {app.hiddenBusy && app.dialog === '' ? <li>
                <span className="fa fa-refresh fa-spin fa-lg" />
              </li> : null}
            <li onClick={create_settings_dialog.bind(this)}>
              <span className="symbolExplanation">Einstellungen</span>
              <span className="fa fa-cog fa-lg" title="Einstellungen" />
            </li>
            {user.id ? <li onClick={create_meal_dialog.bind(this)}>
                <span className="symbolExplanation">Termin anlegen</span>
                <span className="fa fa-plus fa-lg" title="Termin anlegen" />
              </li> : null}
            {user.id ? <li onClick={sign_out.bind(this, user.id)}>
                <span className="symbolExplanation">Abmelden</span>
                <span className="fa fa-sign-out fa-lg" title="Abmelden" />
              </li> : <li onClick={start_sign_in.bind(this)}>
                <span className="symbolExplanation">Anmelden</span>
                <span className="fa fa-sign-in fa-flip-horizontal fa-lg" title="Anmelden" />
              </li>}
          </ul>
        </div>
      </div>
  }
}
