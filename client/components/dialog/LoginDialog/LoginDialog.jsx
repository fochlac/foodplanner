import './LoginDialog.less'

import Dialog from 'DIALOG/Dialog.js'
import InfoBubble from 'RAW/InfoBubble.jsx'
import React from 'react'
import { generateHash } from 'UTILS/crypto.js'

export const userInterface = {
  name: name => /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/.test(name),
  mail: mail => /^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/.test(mail),
  pass: pass => /^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{0,100}$/.test(pass),
}

export const userInterfaceText = {
  name:
    'Bit\u00ADte geb\u00ADen Sie min\u00ADdes\u00ADtens 2 Zei\u00ADchen ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Binde\u00ADstrich und Leer\u00ADzei\u00ADchen sind er\u00ADlaubt.',
  mail:
    'Bit\u00ADte geb\u00ADen Sie eine val\u00ADide Email-Ad\u00ADdres\u00ADse ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Punkt, Binde\u00ADstrich und Un\u00ADter\u00ADstrich sind er\u00ADlaubt.',
  pass:
    "Bit\u00ADte geb\u00ADen Sie ein val\u00ADides Pass\u00ADwort ein. Neben Buch\u00ADsta\u00ADben und Zahl\u00ADen sind fol\u00ADgen\u00ADde Son\u00ADder\u00ADzei\u00ADchen er\u00ADlaubt: .-,|;:_#'+*~?=(/&%$§!)",
}

const wording = {
  name: 'Name',
  mail: 'E-Mail',
  password: 'Passwort',
  passwordRepeat: 'Passwort wiederholen',
  forgotPassword: 'Passwort vergessen',
  login: 'Anmelden',
  register: 'Registrieren',
  forgotPW: 'Passwort zurücksetzen',
}

export default class LoginDialog extends React.Component {
  constructor(props) {
    super()
    this.state = {
      view: 'login',
      name: '',
      mail: '',
      pass: '',
      pass2: '',
    }

    this.nameInput = this.handleInput('name').bind(this)
    this.mailInput = this.handleInput('mail').bind(this)
    this.passInput = this.handleInput('pass').bind(this)
    this.pass2Input = this.handleInput('pass2').bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp(evt) {
    if (evt.keyCode === 13) {
      this.submit()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  submit() {
    const { mail, name, pass, pass2, view } = this.state
    const valid =
      view === 'register'
        ? userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (pass.length && pass2.length && pass2 === pass))
        : userInterface.mail(mail)

    if (!valid) {
      return
    }

    if (view === 'forgotPW') {
      this.setState({view: 'login'})
      return this.props.reset_password(mail)
    }

    generateHash(pass)
      .then(hash => {
        if (view === 'register') {
          this.props.register({ name, mail, hash: pass.length ? hash : undefined })
        } else {
          this.props.sign_in({ mail, hash: pass.length ? hash : undefined })
        }
      })
      .catch(console.log)
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  toggleView(view) {
    this.setState({ view, pass: '', pass2: '' })
  }

  renderRegister() {
    const { mail, name, pass, pass2 } = this.state
    const passwordValid = pass2 === pass.slice(0, pass2.length) || (pass === pass2 && userInterface.pass(pass)) || !pass2.length
    const nameValid = userInterface.name(name) || !name.length
    const mailValid = userInterface.mail(mail) || !mail.length

    return (
      <div>
        <label htmlFor="LoginDialog_name">
          {wording.name}
          <InfoBubble style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
            {userInterfaceText.name}
          </InfoBubble>
        </label>
        <input
          id="LoginDialog_name"
          className={'name' + (!nameValid ? ' invalid' : '')}
          type="text"
          placeholder="Name"
          value={name}
          onChange={this.nameInput}
          autoComplete="name"
        />
        <label htmlFor="LoginDialog_mail">
          {wording.mail}
          <InfoBubble style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
            {userInterfaceText.mail}
          </InfoBubble>
        </label>
        <input
          id="LoginDialog_mail"
          className={'mail' + (!mailValid ? ' invalid' : '')}
          type="text"
          placeholder={wording.mail}
          onChange={this.mailInput}
          value={mail}
          autoComplete="email"
        />
        <label htmlFor="LoginDialog_pass">
          {wording.password}
          <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk optional" arrow="top">
            {userInterfaceText.pass}
          </InfoBubble>
        </label>
        <input
          id="LoginDialog_pass"
          className={'pass' + (!passwordValid ? ' invalid' : '')}
          type="password"
          placeholder={wording.password}
          onChange={this.passInput}
          value={pass}
          autoComplete="new-password"
        />
        {pass.length ? (
          <span>
            <label htmlFor="LoginDialog_pass2">
              {wording.passwordRepeat}
              <InfoBubble style={{ bottom: '28px', left: '-80px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                {userInterfaceText.pass}
              </InfoBubble>
            </label>
            <input
              id="LoginDialog_pass2"
              className={'pass' + (!passwordValid ? ' invalid' : '')}
              type="password"
              placeholder={wording.passwordRepeat}
              onChange={this.pass2Input}
              value={pass2}
              autoComplete="new-password"
            />
          </span>
        ) : null}
      </div>
    )
  }

  renderForgot() {
    const { mail } = this.state
    return (
      <div className="login">
        <label htmlFor="LoginDialog_mail">
          {wording.mail}
          <span className="fa fa-asterisk required" />
        </label>
        <input id="LoginDialog_mail" className="mail" type="text" placeholder={wording.mail} value={mail} onChange={this.mailInput} autoComplete="mail" />
      </div>
    )
  }

  renderLogin() {
    const { mail, pass } = this.state
    return (
      <div className="login">
        <label htmlFor="LoginDialog_mail">
          {wording.mail}
          <span className="fa fa-asterisk required" />
        </label>
        <input id="LoginDialog_mail" className="mail" type="text" placeholder={wording.mail} value={mail} onChange={this.mailInput} autoComplete="mail" />
        <label htmlFor="LoginDialog_pass">{wording.password}</label>
        <input
          id="LoginDialog_pass"
          className="pass"
          type="password"
          placeholder={wording.password}
          value={pass}
          onChange={this.passInput}
          autoComplete="password"
        />
        <p className="fakeLink forgotPW" onClick={this.toggleView.bind(this, 'forgotPW')}>
          {wording.forgotPassword}
        </p>
      </div>
    )
  }

  render() {
    const { mail, name, pass, pass2, view } = this.state
    const valid =
      view === 'register'
        ? userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass))
        : userInterface.mail(mail)

    return <Dialog className="loginDialog">
        <div className="titlebar">
          <h3>{wording[view]}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.props.close_dialog} />
        </div>
        <div className="body">
          {!this.props.hideRegister && <ul className="tabList">
              <li className={'signinLink' + (view !== 'register' ? ' selected' : '')} onClick={this.toggleView.bind(this, 'login')}>
                {wording.login}
              </li>
              <li className={'registerLink' + (view === 'register' ? ' selected' : '')} onClick={this.toggleView.bind(this, 'register')}>
                {wording.register}
              </li>
            </ul>}
          {view === 'register' && this.renderRegister()}
          {view === 'login' && this.renderLogin()}
          {view === 'forgotPW' && this.renderForgot()}
        </div>
        <div className="foot">
          <button className="submit" disabled={!valid} onClick={this.submit.bind(this)}>
            {wording[view]}
          </button>
        </div>
      </Dialog>
  }
}
