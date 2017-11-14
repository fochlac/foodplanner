import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.less';

export default class Topbar extends React.Component {
  constructor(props) {
    super();

    this.state = {
      showLogin: false,
      name: '',
      pass: ''
    }

    this.nameInput = this.handleInput('name').bind(this);
    this.passInput = this.handleInput('pass').bind(this);
  }

  showLogin(state) {
    this.setState({showLogin: state});
  }

  signIn() {
    const s = this.state;

    if (!s.name.length || !s.pass.length) {
      return;
    }

    this.props.start_login({
      name: s.name,
      pass: s.pass
    });
  }

  signOut() {
    this.props.logout();
  }

  handleInput(field) {
    return (evt) => {
      this.setState({
        [field]: evt.target.value
      });
    };
  }

  render() {
    const user = this.props.user;

    return (
      <div className="topbar">
        <div className="spacer">
          <span className="fa fa-cutlery fa-lg"></span>
          <h3>Essensplaner</h3>
          <ul className="quicklinks hidden">
            <li>
              {
                user.anon
                ? null
                : <Link to="/settings"><span className="fa fa-cog fa-lg" title="Settings"></span></Link>
              }
            </li>
            <li>
              {
                user.anon
                ? (
                    this.state.showLogin
                    ? (
                        <span className="loginbox">
                          <label htmlFor="name">Name</label>
                          <input type="text" id="name" onChange={this.nameInput}/>
                          <label htmlFor="pass">Passwort</label>
                          <input type="password" id="pass" onChange={this.passInput}/>
                          {
                            this.props.logging
                            ? <span className="fa fa-spinner fa-spin fa-lg fa-fw"></span>
                            : <button type="button" onClick={() => this.signIn()}>Einloggen</button>
                          }
                        </span>
                      )
                    : <span className="fa fa-sign-in fa-lg pointer" title="Anmelden" onClick={() => this.showLogin(true)}></span>
                  )
                : this.props.logging
                  ? <span className="fa fa-spinner fa-spin fa-lg fa-fw"></span>
                  : <span className="fa fa-sign-out fa-lg pointer" title="Abmelden" onClick={() => this.signOut()}></span>
              }
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
