import './LoginDialog.less'

import Dialog from 'UI/Dialog.js';
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'
import { generateHash } from 'SCRIPTS/crypto.js'

const userInterface = {
  name: (name) => (/^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/).test(name),
  mail: (mail) => (/^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/).test(mail),
  pass: (pass) => (/^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{0,100}$/).test(pass),
}

const userInterfaceText = {
  name: "Bitte geben Sie mindestens 2 Buchstaben ein. Buchstaben, Zahlen, Bindestrich und Leerzeichen sind erlaubt.",
  mail: "Bitte geben Sie eine valide Email-Addresse ein. Buchstaben, Zahlen, Punkt, Bindestrich und Unterstrich sind erlaubt.",
  pass: "Bitte geben Sie ein valides Passwort ein. Neben Buchstaben und Zahlen sind folgende Sonderzeichen erlaubt: .-,|;:_#'+*~?=(/&%$§!)"
}

export default class LoginDialog extends React.Component {
  constructor(props) {
    super()
    this.state = {
      register: false,
      name: '',
      mail: '',
      pass: '',
      pass2: ''
    }

    this.nameInput = this.handleInput('name').bind(this)
    this.mailInput = this.handleInput('mail').bind(this)
    this.passInput = this.handleInput('pass').bind(this)
    this.pass2Input = this.handleInput('pass2').bind(this)
  }

  submit() {
    const { mail, name, pass, pass2, register } = this.state
    const valid = register ? userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (pass.length && pass2.length && pass2 === pass)) : userInterface.mail(mail);
    if (!valid) {
      return;
    }

    generateHash(pass)
      .then(hash => {
        if (register) {
          this.props.register({
            name,
            mail,
            hash: pass.length ? hash : undefined
          })
        } else {
          this.props.sign_in({
            mail,
            hash: pass.length ? hash : undefined
          })
        }
      })
      .catch(console.log);
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  toggleRegister(register) {
    this.setState({ register, pass: '', pass2: '' });
  }

  render() {
    const { mail, name, pass, pass2, register } = this.state
    const valid = register
      ? userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass))
      : userInterface.mail(mail);
    const passwordValid = pass2.length < pass.length || pass === pass2 && userInterface.pass(pass);
    const nameValid = userInterface.name(name) || !name.length;
    const mailValid = userInterface.mail(mail) || !mail.length;

    return <Dialog className="loginDialog">
        <div className="titlebar">
          <h3>{register ? 'Registrieren' : 'Anmelden'}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.props.close_dialog} />
        </div>
        <div className="body">
          {register ? <div>
              <label htmlFor="LoginDialog_name">
                Name
                <InfoBubble style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
                  {userInterfaceText.name}
                </InfoBubble>
              </label>
              <input id="LoginDialog_name" className={'name' + (!nameValid ? ' invalid' : '')} type="text" placeholder="Name" value={name} onChange={this.nameInput} />
              <label htmlFor="LoginDialog_mail">
                Email
                <InfoBubble style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
                  {userInterfaceText.mail}
                </InfoBubble>
              </label>
              <input id="LoginDialog_mail" className={'mail' + (!mailValid ? ' invalid' : '')} type="text" placeholder="E-Mail" onChange={this.mailInput} value={mail} />
              <label htmlFor="LoginDialog_pass">
                Passwort
                <InfoBubble style={{ top: '30px', left: '19px', width: '160px' }} symbol="fa-asterisk optional" arrow="right">
                  {userInterfaceText.pass}
                </InfoBubble>
              </label>
              <input id="LoginDialog_pass" className={'pass' + (!passwordValid ? ' invalid' : '')} type="password" placeholder="Passwort (optional)" onChange={this.passInput} value={pass} />
              {pass.length ? <span>
                  <label htmlFor="LoginDialog_pass2">
                    Passwort wiederholen
                    <InfoBubble style={{ bottom: '28px', left: '-80px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                      {userInterfaceText.pass}
                    </InfoBubble>
                  </label>
                  <input id="LoginDialog_pass2" className={'pass' + (!passwordValid ? ' invalid' : '')} type="password" placeholder="Passwort wiederholen" onChange={this.pass2Input} value={pass2} />
                </span> : null}
              <p className="fakeLink signinLink toggleRegister" onClick={this.toggleRegister.bind(this, false)}>
                <span>
                  <span className="fa fa-angle-double-left" /> Zurück zur Anmeldung
                </span>
              </p>
            </div> : <div className="login">
              <label htmlFor="LoginDialog_mail">
                Email<span className="fa fa-asterisk required" />
              </label>
              <input id="LoginDialog_mail" className="mail" type="text" placeholder="E-Mail" value={mail} onChange={this.mailInput} />

              <label htmlFor="LoginDialog_pass">Passwort</label>
              <input id="LoginDialog_pass" className="pass" type="password" placeholder="Passwort (optional)" value={pass} onChange={this.passInput} />
              <p className="fakeLink registerLink toggleRegister" onClick={this.toggleRegister.bind(this, true)}>
                <span>
                  Ein neues Konto anlegen <span className="fa fa-angle-double-right" />
                </span>
              </p>
            </div>}
        </div>
        <div className="foot">
          <button className="submit" disabled={!valid} onClick={this.submit.bind(this)}>
            {register ? 'Registrieren' : 'Anmelden'}
          </button>
        </div>
      </Dialog>
  }
}
