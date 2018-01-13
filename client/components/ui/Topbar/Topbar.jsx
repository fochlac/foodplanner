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
          <h3 className="pointer" onClick={() => window.location.href = window.location.origin}>Mittagsplaner</h3>
          <ul className="quicklinks">
            {
              (this.props.app.hiddenBusy && this.props.app.dialog === '')
              ? <li>
                  <span className="fa fa-refresh fa-spin fa-lg"></span>
              </li>
              : null
            }
            <li>
                <span className="fa fa-cog fa-lg pointer" title="Einstellungen" onClick={this.props.create_settings_dialog.bind(this)}></span>
            </li>
            {
              this.props.user.id
              ? <li>
                  <span className="fa fa-plus fa-lg pointer" title="Mahlzeit anlegen" onClick={this.props.create_meal_dialog.bind(this)}></span>
              </li>
              : null
            }
            {
              this.props.user.id
              ? <li>
                  <span className="fa fa-sign-out fa-lg pointer" title="Abmelden" onClick={this.props.sign_out.bind(this, this.props.user.id)}></span>
              </li>
              : null
            }
          </ul>
        </div>
      </div>
    );
  }
}
