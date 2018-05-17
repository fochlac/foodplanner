import './LoginDialog.less'

import Dialog from 'DIALOG/Dialog.js'
import InfoBubble from 'RAW/InfoBubble.jsx'
import InputRow from 'RAW/InputRow.jsx'
import React from 'react'
import { generateHash } from 'UTILS/crypto.js'

export const userInterface = {
  name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
  mail: /^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/,
  pass: /^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{0,100}$/,
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
  pwSent: 'Ein Link zum Zurück\u00ADsetzen deines Pass\u00ADwortes wurde generiert und an die hinter\u00ADlegte E-Mail Adresse ge\u00ADschickt.',
  pwResetSuccess: 'Pass\u00ADwort erfolg\u00ADreich zurück\u00ADgesetzt. Eine E-Mail mit dem neuen Pass\u00ADwort wurde dir zugesandt.',
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
        ? userInterface.mail.test(mail) && userInterface.name.test(name) && (!pass.length || (pass.length && pass2.length && pass2 === pass))
        : userInterface.mail.test(mail)

    if (!valid) {
      return
    }

    if (view === 'forgotPW') {
      this.setState({ view: 'login', showSuccess: true })
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
    return value => {
      this.setState({
        [field]: value,
      })
    }
  }

  toggleView(view) {
    this.setState({ view, pass: '', pass2: '' })
  }

  renderRegister() {
    const { mail, name, pass, pass2 } = this.state
    const passwordValid = pass2 === pass.slice(0, pass2.length) || (pass === pass2 && userInterface.pass.test(pass)) || !pass2.length

    return (
      <div>
        <InputRow
          defaultValue={name}
          label={[
            wording.name,
            <InfoBubble key="info" style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
              {userInterfaceText.name}
            </InfoBubble>,
          ]}
          required={false}
          autoComplete="name"
          userInterface={userInterface.name}
          onChange={this.nameInput}
          id="LoginDialog_name"
        />
        <InputRow
          defaultValue={mail}
          label={[
            wording.mail,
            <InfoBubble key="info" style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
              {userInterfaceText.mail}
            </InfoBubble>,
          ]}
          required={false}
          userInterface={userInterface.mail}
          placeholder={wording.mail}
          onChange={this.mailInput}
          autoComplete="email"
          id="LoginDialog_mail"
        />
        <InputRow
          defaultValue={pass}
          label={[
            wording.password,
            <InfoBubble key="info" style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk optional" arrow="top">
              {userInterfaceText.pass}
            </InfoBubble>,
          ]}
          valid={passwordValid}
          required={false}
          userInterface={userInterface.pass}
          placeholder={wording.password}
          onChange={this.passInput}
          autoComplete="new-password"
          id="LoginDialog_pass"
        />
        <InputRow
          defaultValue={pass2}
          label={[
            wording.passwordRepeat,
            <InfoBubble key="info" style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk optional" arrow="top">
              {userInterfaceText.pass}
            </InfoBubble>,
          ]}
          valid={passwordValid}
          required={false}
          userInterface={userInterface.pass}
          placeholder={wording.passwordRepeat}
          onChange={this.pass2Input}
          autoComplete="new-password"
          id="LoginDialog_pass2"
        />
      </div>
    )
  }

  renderForgot() {
    const { mail } = this.state
    return (
      <div className="login">
        <InputRow
          defaultValue={mail}
          label={[
            wording.mail,
            <InfoBubble key="info" style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
              {userInterfaceText.mail}
            </InfoBubble>,
          ]}
          required={false}
          userInterface={userInterface.mail}
          placeholder={wording.mail}
          onChange={this.mailInput}
          autoComplete="email"
          id="LoginDialog_name"
        />
      </div>
    )
  }

  renderLogin() {
    const { mail, pass } = this.state
    return (
      <div className="login">
        <InputRow
          defaultValue={mail}
          label={[
            wording.mail,
            <InfoBubble key="info" style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
              {userInterfaceText.mail}
            </InfoBubble>,
          ]}
          required={false}
          userInterface={userInterface.mail}
          placeholder={wording.mail}
          onChange={this.mailInput}
          autoComplete="email"
          id="LoginDialog_mail"
        />
        <InputRow
          defaultValue={pass}
          label={[
            wording.password,
            <InfoBubble key="info" style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk optional" arrow="top">
              {userInterfaceText.pass}
            </InfoBubble>,
          ]}
          required={false}
          userInterface={userInterface.pass}
          placeholder={wording.password}
          onChange={this.passInput}
          autoComplete="new-password"
          id="LoginDialog_pass"
        />
        <p className="fakeLink forgotPW" onClick={this.toggleView.bind(this, 'forgotPW')}>
          {wording.forgotPassword}
        </p>
      </div>
    )
  }

  render() {
    const { mail, name, pass, pass2, view, showSuccess } = this.state
    const { close_dialog, hideRegister, resetPassword } = this.props
    const valid =
      view === 'register'
        ? userInterface.mail.test(mail) &&
          userInterface.name.test(name) &&
          (!pass.length || (userInterface.pass.test(pass) && userInterface.pass.test(pass2) && pass2 === pass))
        : userInterface.mail.test(mail)

    return (
      <Dialog className="loginDialog">
        <div className="titlebar">
          <h3>{wording[view]}</h3>
          <span className="fa fa-times push-right pointer" onClick={close_dialog} />
        </div>
        <div className="body">
          {showSuccess && <div className="success">{wording.pwSent}</div>}
          {resetPassword && <div className="success">{wording.pwResetSuccess}</div>}
          {!hideRegister && (
            <ul className="tabList">
              <li className={'signinLink' + (view !== 'register' ? ' selected' : '')} onClick={this.toggleView.bind(this, 'login')}>
                {wording.login}
              </li>
              <li className={'registerLink' + (view === 'register' ? ' selected' : '')} onClick={this.toggleView.bind(this, 'register')}>
                {wording.register}
              </li>
            </ul>
          )}
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
    )
  }
}
