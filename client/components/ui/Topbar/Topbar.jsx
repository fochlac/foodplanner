import './Topbar.less';

import { Link } from 'react-router-dom';
import React from 'react';

export default class Topbar extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="topbar">
        <div className="spacer">
          <span className="fa fa-cutlery fa-lg"></span>
          <h3 className="pointer" onClick={() => window.location.assign(window.location.origin)}>Mittagsplaner</h3>
          <ul className="quicklinks">
            {
              (this.props.app.hiddenBusy && this.props.app.dialog === '')
              ? <li>
                  <span className="fa fa-refresh fa-spin fa-lg"></span>
              </li>
              : null
            }
            <li onClick={this.props.create_settings_dialog.bind(this)}>
                <span className="symbolExplanation">Einstellungen</span>
                <span className="fa fa-cog fa-lg" title="Einstellungen"></span>
            </li>
            {
              this.props.user.id
              ? <li onClick={this.props.create_meal_dialog.bind(this)}>
                  <span className="symbolExplanation">Termin anlegen</span>
                  <span className="fa fa-plus fa-lg" title="Termin anlegen"></span>
              </li>
              : null
            }
            {
              this.props.user.id
              ? <li onClick={this.props.sign_out.bind(this, this.props.user.id)}>
                  <span className="symbolExplanation">Abmelden</span>
                  <span className="fa fa-sign-out fa-lg" title="Abmelden"></span>
              </li>
                : <li onClick={this.props.start_sign_in.bind(this)}>
                <span className="symbolExplanation">Anmelden</span>
                  <span className="fa fa-sign-in fa-flip-horizontal fa-lg" title="Anmelden"></span>
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }
}
