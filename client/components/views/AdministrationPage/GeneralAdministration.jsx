import React from 'react'

const wording = {
  title: 'Seitenüberschrift',
  gmail: 'Google Mail Anbindung',
  gmailConnectionSuccess: 'Verbindung erfolgreich hergestellt.',
  gmailConnectionError: 'Fehler beim Herstellen der Verbindung.',
  noConnection: 'Sie sind aktuell nicht mit G-Mail verbunden.',
  connectNow: 'Jetzt mit G-Mail verbinden.',
  connect: 'Verbinden',
  gmailInfo: 'Um Emails mit dem Terminplaner versenden zu können, geben Sie bitte Nutzername und Passwort für den dazu zu verwendenden G-Mail Account ein.',
  password: 'Passwort',
  user: 'Benutzername',
  icon: 'Icon',
  submit: 'Speichern',
  cancel: 'Abbrechen',
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

  handleInput(field) {
    return evt => {
      this.setState({ [field]: evt.target.value })
    }
  }

  render() {
    const { title, icon, gmail_user, gmail_pass, gmail_edit, gmail_state } = this.state
    const valid = true

    return (
      <div className="blockList">
        <div className="settings">
          <div>
            <label htmlFor="General_Admin_title">{wording.title}</label>
            <input type="text" id="General_Admin_title" autofill="eventplanner_title" value={title} onChange={this.titleInput} />
          </div>
          <div>
            <label htmlFor="General_Admin_icon">{wording.icon}</label>
            <input type="text" id="General_Admin_icon" autofill="eventplanner_icon" value={icon} onChange={this.iconInput} />
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
    const gmail_valid = true

    return (
      <div>
        <p className="gmailInfo">{wording.gmailInfo}</p>
        <div className="row">
          <div>
            <label>{wording.user}</label>
            <input type="text" autofill="eventplanner_gmail_user" value={gmail_user} onChange={this.guserInput} />
          </div>
          <div>
            <label>{wording.password}</label>
            <input type="password" autofill="eventplanner_gmail_pass" value={gmail_pass} onChange={this.gpassInput} />
          </div>
        </div>
        <div className="row right">
          <button type="button" onClick={() => this.setState({ gmail_edit: false })}>
            {wording.cancel}
          </button>
          <button type="button" onClick={() => this.connectGmail()} disabled={!gmail_valid}>
            {wording.connect}
          </button>
        </div>
      </div>
    )
  }

  renderGmailConnection() {
    const { gmail_user, gmail_state } = this.state
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
            {wording.user}: <b className="noWrap">{gmail_user}<span className="fa fa-pencil edit marginLeft fakeLink" onClick={() => this.setState({ gmail_edit: true })} /></b>
          </span>

        </p>
      </div>
    )
  }
}
