import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.less';

export default class Topbar extends React.Component {
  constructor(props) {
    super();
  }

  showSettings() {
    this.props.create_settings_dialog();
  }

  createMeal() {
    this.props.create_meal_dialog();
  }

  render() {
    return (
      <div className="topbar">
        <div className="spacer">
          <span className="fa fa-cutlery fa-lg"></span>
          <h3>Mittagsplaner</h3>
          <ul className="quicklinks">
            <li>
                <span className="fa fa-cog fa-lg pointer" title="Einstellungen" onClick={() => this.showSettings()}></span>
            </li>
            <li>
                <span className="fa fa-plus fa-lg pointer" title="Mahlzeit anlegen" onClick={() => this.createMeal()}></span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
