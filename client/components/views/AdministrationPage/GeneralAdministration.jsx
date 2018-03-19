import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'

const wording = {
  title: 'Seitenüberschrift',
  gmail: 'Google Mail Anbindung',
  gmailCheckConnection: 'Überprüfen der Verbindung',
  gmailConnectionSuccess: 'Verbindung erfolgreich hergestellt.',
  gmailConnectionError: 'Fehler beim Herstellen der Verbindung.',
  noConnection: 'Sie sind aktuell nicht mit G-Mail verbunden.',
  connectNow: 'Jetzt mit G-Mail verbinden.',
  connect: 'Verbinden',
  gmailInfo: 'Um E-Mails mit dem Terminplaner versenden zu können, geben Sie bitte Nutzername und Passwort für den dazu zu verwendenden G-Mail Account ein.',
  iconInfo: 'Als Icons können Sie jedes beliebige Font Awesome 4-Icon verwenden.',
  password: 'Passwort',
  user: 'Benutzername',
  icon: 'Icon',
  submit: 'Speichern',
  cancel: 'Abbrechen',
}

const gmailInterface = {
  user: user => /^[\_A-Za-z0-9.\-]{1,50}@gmail\.[A-Za-z]{1,6}$/.test(user),
  pass: pass => /^[^%]{1,100}$/.test(pass),
}

export default class GeneralAdministration extends React.Component {
  constructor({ instance }) {
    super()

    this.state = {
      title: instance.title || '',
      icon: instance.icon || '',
      gmail_user: instance.gmail_user || '',
      gmail_pass: instance.gmail_pass || '',
      gmail_state: instance.gmail_state || true,
    }

    this.titleInput = this.handleInput('title').bind(this)
    this.iconInput = this.handleInput('icon').bind(this)
    this.guserInput = this.handleInput('gmail_user').bind(this)
    this.gpassInput = this.handleInput('gmail_pass').bind(this)
  }

  componentWillReceiveProps({ instance }) {
    this.setState({
      title: instance.title || '',
      icon: instance.icon || '',
      gmail_user: instance.gmail_user || '',
      gmail_pass: instance.gmail_pass || '',
      gmail_state: instance.gmail_state || true,
    })
  }

  componentDidMount() {
    if (gmail_user.length) {
      this.props.validateGmail(this.props.instance.id)
    }
  }

  handleInput(field) {
    return evt => {
      this.setState({ [field]: evt.target.value })
    }
  }

  saveGmail() {
    const { gmail_user, gmail_pass } = this.state
    if (gmailInterface.user(gmail_user) && gmailInterface.pass(gmail_pass)) {
      this.props.saveGmail(this.props.instance.id, {
        gmail_user,
        gmail_pass,
      })
    }
  }

  render() {
    const { title, icon, gmail_user, gmail_pass, gmail_edit, gmail_state } = this.state
    const { saveInstanceData } = this.props
    const valid = true

    return (
      <div className="blockList">
        <div className="settings">
          <div>
            <label htmlFor="General_Admin_title">{wording.title}</label>
            <input
              type="text"
              id="General_Admin_title"
              autofill="eventplanner_title"
              value={title}
              onChange={this.titleInput}
              onBlur={() => title !== this.props.title && saveInstanceData({ title })}
            />
          </div>
          <div>
            <label htmlFor="General_Admin_icon">
              {wording.icon}
              <InfoBubble style={{ bottom: '26px', right: '-110px', width: '210px' }} arrow="top">
                {wording.iconInfo}
              </InfoBubble>
            </label>
            <input
              type="text"
              id="General_Admin_icon"
              autofill="eventplanner_icon"
              value={icon}
              onChange={this.iconInput}
              onBlur={() => icon !== this.props.icon && saveInstanceData({ icon })}
            />
          </div>
        </div>
        <div className="gmail">
          <h4 className="title">{wording.gmail}</h4>
          {!gmail_edit ? this.renderGmailConnection() : this.renderGmailForm()}
        </div>
      </div>
    )
  }

  renderGmailForm() {
    const { gmail_user, gmail_pass } = this.state
    const gmail_valid = gmailInterface.user(gmail_user) && gmailInterface.pass(gmail_pass)

    return (
      <div>
        <p className="gmailInfo">{wording.gmailInfo}</p>
        <div className="row">
          <div>
            <label>{wording.user}</label>
            <input
              type="text"
              autofill="eventplanner_gmail_user"
              value={gmail_user}
              onChange={this.guserInput}
              className={gmailInterface.user(gmail_user) ? '' : 'invalid'}
            />
          </div>
          <div>
            <label>{wording.password}</label>
            <input
              type="password"
              autofill="eventplanner_gmail_pass"
              value={gmail_pass}
              onChange={this.gpassInput}
              className={gmailInterface.pass(gmail_pass) ? '' : 'invalid'}
            />
          </div>
        </div>
        <div className="row right">
          <button type="button" onClick={() => this.setState({ gmail_edit: false })}>
            {wording.cancel}
          </button>
          <button type="button" onClick={() => this.saveGmail()} disabled={!gmail_valid}>
            {wording.connect}
          </button>
        </div>
      </div>
    )
  }

  renderGmailConnection() {
    const { gmail_user, gmail_state } = this.state
    const { hiddenBusy, busyType } = this.props.app
    const gmail_valid = true

    if (!gmail_user.length) {
      return (
        <div className="noConnection">
          <p className="info">{wording.noConnection}</p>
          <span className="fakeLink" onClick={() => this.setState({ gmail_edit: true })}>
            {wording.connectNow}
          </span>
        </div>
      )
    }

    if (hiddenBusy && busyType.includes('gmail:validate')) {
      return (
        <div>
          <p className="bold">
            <span className="fa fa-spin fa-circle-notch" />
            <span>{wording.gmailCheckConnection}</span>
          </p>
        </div>
      )
    }

    return (
      <div>
        {gmail_state ? (
          <p className="col_green bold">
            <span className="fa fa-lg fa-check-circle-o" /> {wording.gmailConnectionSuccess}
          </p>
        ) : (
          <p className="col_red bold">
            <span className="fa fa-lg fa-times-circle-o" /> {wording.gmailConnectionError}
          </p>
        )}
        <p>
          <span>
            {wording.user}:{' '}
            <b className="noWrap">
              {gmail_user}
              <span className="fa fa-pencil edit marginLeft fakeLink" onClick={() => this.setState({ gmail_edit: true })} />
            </b>
          </span>
        </p>
      </div>
    )
  }
}
