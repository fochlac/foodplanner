import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.less';

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
            <li onClick={this.props.start_print.bind(this)}>
                <span className="symbolExplanation">Drucken</span>
              <span className="fa fa-print fa-lg"></span>
            </li>
            <li onClick={this.props.create_settings_dialog.bind(this)}>
                <span className="symbolExplanation">Einstellungen</span>
                <span className="fa fa-cog fa-lg" title="Einstellungen"></span>
            </li>
            {
              this.props.user.id
              ? <li onClick={this.props.create_meal_dialog.bind(this)}>
                  <span className="symbolExplanation">Mahlzeit anlegen</span>
                  <span className="fa fa-plus fa-lg" title="Mahlzeit anlegen"></span>
              </li>
              : null
            }
            {
              this.props.user.id
              ? <li onClick={this.props.sign_out.bind(this, this.props.user.id)}>
                  <span className="symbolExplanation">Abmelden</span>
                  <span className="fa fa-sign-out fa-lg" title="Abmelden"></span>
              </li>
              : null
            }
          </ul>
        </div>
      </div>
    );
  }
}
