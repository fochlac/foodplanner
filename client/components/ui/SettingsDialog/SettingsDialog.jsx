import './SettingsDialog.less'

import { userInterface, userInterfaceText } from 'UI/LoginDialog/LoginDialog.jsx'

import Dialog from 'UI/Dialog.js'
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'
import { generateHash } from 'UTILS/crypto.js'
import { getNotificationPermission } from 'UTILS/serviceWorker.js'

export default class SettingsDialog extends React.Component {
  constructor(props) {
    super()

    this.state = {
      id: props.user.id,
      mail: props.user.mail ? props.user.mail : '',
      name: props.user.name ? props.user.name : '',
      pass: '',
      pass2: '',
      creationNotice: props.user.creationNotice ? props.user.creationNotice : 0,
      creationNotice_notification: props.user.creationNotice_notification ? props.user.creationNotice_notification : 0,
      deadlineReminder: props.user.deadlineReminder ? props.user.deadlineReminder : 0,
      deadlineReminder_notification: props.user.deadlineReminder_notification ? props.user.deadlineReminder_notification : 0,
    }

    this.handleCheck = this.handleCheck.bind(this)
    this.mailInput = this.handleInput('mail').bind(this)
    this.nameInput = this.handleInput('name').bind(this)
    this.passInput = this.handleInput('pass').bind(this)
    this.pass2Input = this.handleInput('pass2').bind(this)

    this.mySetState = function(data, cb) {
      this.setState(data, () => {
        const app = history && history.state && history.state.app ? history.state.app : {}
        history.replaceState({ app: { ...app, dialog: { ...(app.dialog ? app.dialog : {}), state: this.state } } }, document.title, document.location.pathname)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.deadlineReminder_notification !== this.props.user.deadlineReminder_notification ||
      nextProps.user.creationNotice_notification !== this.props.user.creationNotice_notification
    ) {
      this.setState({
        deadlineReminder_notification: nextProps.user.deadlineReminder_notification ? nextProps.user.deadlineReminder_notification : 0,
        creationNotice_notification: nextProps.user.creationNotice_notification ? nextProps.user.creationNotice_notification : 0,
      })
    }
  }

  submit() {
    const { mail, name, pass2, pass, deadlineReminder_notification, creationNotice_notification } = this.state
    let getHash = Promise.resolve()
    const valid =
      userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass))

    if (!valid && this.props.user.id) {
      return
    }

    if (pass.length) {
      getHash = generateHash(pass)
    }

    getHash
      .then(hash => {
        if (deadlineReminder_notification || creationNotice_notification) {
          getNotificationPermission()
            .then(() => {
              if (this.props.user.id) {
                this.props.save_settings(this.state, hash)
              } else {
                this.props.save_settings_locally(this.state)
              }
            })
            .catch(err => {
              this.props.create_error('notification_denied', 'In order to use the notification settings, please setup your browser to allow notifications.')
              setTimeout(() => this.props.delete_error('notification_denied'), 10000)
              this.mySetState({
                deadlineReminder_notification: 0,
                creationNotice_notification: 0,
              })
            })
        } else if (this.props.user.id) {
          this.props.save_settings(this.state, hash)
        }
      })
      .catch(console.err)
  }

  cancel() {
    this.props.close_dialog()
  }

  handleInput(field) {
    return evt => {
      this.mySetState({
        [field]: evt.target.value,
      })
    }
  }

  handleCheck(event, type) {
    return evt => {
      this.mySetState({
        [event + (type ? '_' + type : '')]: +evt.target.checked,
      })
    }
  }

  render() {
    const { mail, name, pass2, pass, creationNotice, creationNotice_notification, deadlineReminder, deadlineReminder_notification } = this.state,
      notificationsBlocked = Notification.permission === 'denied'
    const valid =
      !this.props.user.id ||
      (userInterface.mail(mail) && userInterface.name(name) && (!pass.length || (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass)))
    const passwordValid = pass2 === pass.slice(0, pass2.length) || (pass === pass2 && userInterface.pass(pass)) || !pass2.length
    const nameValid = userInterface.name(name)
    const mailValid = userInterface.mail(mail)
    return (
      <Dialog className="settingsDialog">
        <div className="titlebar">
          <h3>Einstellungen</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body">
          {this.props.user.id ? (
            <div>
              <div>
                <div>
                  <label htmlFor="SettingsDialog_name">
                    Name
                    <InfoBubble style={{ top: '-8px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
                      {userInterfaceText.name}
                    </InfoBubble>
                  </label>
                  <input
                    type="text"
                    id="SettingsDialog_name"
                    value={name}
                    className={!nameValid ? 'invalid' : ''}
                    onChange={this.nameInput}
                    autoComplete="name"
                  />
                </div>
                <div className="mailFrame">
                  <label htmlFor="SettingsDialog_mail">
                    E-Mail
                    <InfoBubble style={{ top: '-4px', left: '19px', width: '180px' }} symbol="fa-asterisk required" arrow="right">
                      {userInterfaceText.mail}
                    </InfoBubble>
                  </label>
                  <input
                    type="text"
                    id="SettingsDialog_mail"
                    value={mail}
                    className={!mailValid ? 'invalid' : ''}
                    onChange={this.mailInput}
                    autoComplete="mail"
                  />
                </div>
                <div>
                  <label htmlFor="SettingsDialog_pass">
                    Passwort
                    <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk optional" arrow="top">
                      {userInterfaceText.pass}
                    </InfoBubble>
                  </label>
                  <input
                    id="SettingsDialog_pass"
                    className={!passwordValid ? 'invalid' : ''}
                    type="password"
                    placeholder="Passwort (optional)"
                    onChange={this.passInput}
                  />
                </div>
                {pass.length ? (
                  <div>
                    <label htmlFor="SettingsDialog_pass2">
                      Passwort wiederholen
                      <InfoBubble style={{ bottom: '28px', left: '-80px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                        {userInterfaceText.pass}
                      </InfoBubble>
                    </label>
                    <input
                      id="SettingsDialog_pass2"
                      className={!passwordValid ? ' invalid' : ''}
                      type="password"
                      placeholder="Passwort wiederholen"
                      onChange={this.pass2Input}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <h4>Benachrichtigungen:</h4>
          <table className="notificationMatrix">
            <thead>
              <tr>
                <th>Ereignis</th>
                <th>
                  E-Mail
                  {!this.props.user.id && (
                    <InfoBubble style={{ bottom: '-60px', right: '26px', width: '180px' }} arrow="left">
                      Um E-Mail-Benachrichtigungen zu aktivieren,{' '}
                      <span className="fakeLink pointer" onClick={this.props.start_sign_in}>
                        erstellen Sie bitte einen Account oder melden sich an.
                      </span>
                    </InfoBubble>
                  )}
                </th>
                <th>
                  Push-Nachricht
                  <InfoBubble style={{ bottom: '-60px', right: '26px', width: '180px' }} arrow="left">
                    Die Einstellungen für Push-Nachrichten gelten jeweils nur für das Gerät, auf dem sie ausgewählt wurden.
                  </InfoBubble>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Neues Angebot</td>
                {!this.props.user.id ? (
                  <td className="notification createdMail" data-fieldtype="E-Mail">
                    <input type="checkbox" disabled={true} title="Bitte registrieren Sie sich, um diese Option wählen zu können." />
                  </td>
                ) : (
                  <td className="notification createdMail" data-fieldtype="E-Mail">
                    <input type="checkbox" onChange={this.handleCheck('creationNotice')} checked={creationNotice} />
                  </td>
                )}
                {notificationsBlocked ? (
                  <td className="notification createdNotification" data-fieldtype="Push-Notification">
                    <input
                      type="checkbox"
                      disabled={true}
                      checked={creationNotice_notification}
                      title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;&#10;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können."
                    />
                  </td>
                ) : (
                  <td className="notification createdNotification" data-fieldtype="Push-Notification">
                    <input type="checkbox" onChange={this.handleCheck('creationNotice', 'notification')} checked={creationNotice_notification} />
                  </td>
                )}
              </tr>
              <tr>
                <td>Anmeldungsfrist läuft ab</td>
                {!this.props.user.id ? (
                  <td className="notification deadlineMail" data-fieldtype="E-Mail">
                    <input type="checkbox" disabled={true} title="Bitte registrieren Sie sich, um diese Option wählen zu können." />
                  </td>
                ) : (
                  <td className="notification deadlineMail" data-fieldtype="E-Mail">
                    <input type="checkbox" onChange={this.handleCheck('deadlineReminder')} checked={deadlineReminder} />
                  </td>
                )}
                {notificationsBlocked ? (
                  <td className="notification deadlineNotification" data-fieldtype="Push-Notification">
                    <input
                      type="checkbox"
                      disabled={true}
                      checked={deadlineReminder_notification}
                      title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können."
                    />
                  </td>
                ) : (
                  <td className="notification deadlineNotification" data-fieldtype="Push-Notification">
                    <input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'notification')} checked={deadlineReminder_notification} />
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
            Abbrechen
          </button>
          <button className="submit" disabled={!valid} type="button" onClick={this.submit.bind(this)}>
            Bestätigen
          </button>
        </div>
      </Dialog>
    )
  }
}
