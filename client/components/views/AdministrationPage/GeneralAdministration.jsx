import InfoBubble from 'RAW/InfoBubble.jsx'
import InputRow from 'RAW/InputRow.jsx'
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

const userInterface = {
  user: /^[\_A-Za-z0-9.\-]{1,50}@gmail\.[A-Za-z]{1,6}$/,
  pass: /^[^%]{1,100}$/,
  title: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,100}$/,
  icon: /^fa-[A-Za-z0-9\-]{0,50}$/,
}

export default class GeneralAdministration extends React.Component {
  constructor({ instance }) {
    super()

    this.state = {
      gmail_user: instance.gmail_user || '',
      gmail_pass: instance.gmail_pass || '',
      gmail_state: instance.gmail_state !== undefined ? instance.gmail_state : true,
    }
  }

  componentWillReceiveProps({ instance }) {
    this.setState({
      gmail_state: instance.gmail_state !== undefined ? instance.gmail_state : true,
      gmail_edit: instance.gmail_state ? false : this.state.gmail_edit,
    })
  }

  componentDidMount() {
    const { gmail_user, id } = this.props.instance

    if (gmail_user && userInterface.user.test(gmail_user)) {
      this.props.validateGmail(id)
    }
  }

  saveGmail() {
    const { gmail_user, gmail_pass } = this.state

    if (userInterface.user.test(gmail_user) && userInterface.pass.test(gmail_pass)) {
      this.props.saveGmail(this.props.instance.id, {
        gmail_user,
        gmail_pass,
      })
    }
  }

  render() {
    const { gmail_edit } = this.state
    const { saveInstanceData, app, instance } = this.props
    const gmailBusy = app.hiddenBusy && app.busyList.includes('gmail')

    return (
      <div className="blockList">
        <div className="colRowGrid">
          <div className="row wrap alignStart">
            <div className="col settings">
              <InputRow
                defaultValue={instance.title}
                autoComplete="eventplanner_title"
                userInterface={userInterface.title}
                onBlur={(title, isValid) => title !== instance.title && isValid && saveInstanceData(instance.id, { title })}
                label={wording.title}
              />
              <InputRow
                defaultValue={instance.icon}
                autoComplete="eventplanner_icon"
                userInterface={userInterface.icon}
                onBlur={(icon, isValid) => icon !== instance.icon && isValid && saveInstanceData(instance.id, { icon })}
                label={[
                  wording.icon,
                  <InfoBubble key="1" style={{ bottom: '26px', right: '-80px', width: '140px' }} arrow="top">
                    {wording.iconInfo}
                  </InfoBubble>,
                ]}
              />
            </div>
            <div className="col gmail alignCenter">
              <h4 className="title">{wording.gmail}</h4>
              {gmailBusy && (
                <div>
                  <p className="bold textAlignCenter col_green">
                    <span className="fa fa-spin fa-spinner marginRight" />
                    <span>{wording.gmailCheckConnection}</span>
                  </p>
                </div>
              )}
              {!gmailBusy && (!gmail_edit ? this.renderGmailConnection() : this.renderGmailForm())}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderGmailForm() {
    const { gmail_user, gmail_pass, gmail_state, originalGmail_state, user_valid, pass_valid } = this.state
    const gmail_valid = userInterface.user.test(gmail_user) && userInterface.pass.test(gmail_pass)
    const { instance, validateGmail } = this.props

    return (
      <div className="colRowGrid">
        <div className="col">
          {!gmail_state && (
            <p className="col_red bold">
              <span className="fa fa-lg fa-times-circle-o" /> {wording.gmailConnectionError}
            </p>
          )}
          <p className="gmailInfo">{wording.gmailInfo}</p>
          <div className="row">
            <InputRow
              defaultValue={gmail_user}
              autoComplete="eventplanner_gmail_user"
              userInterface={userInterface.user}
              onChange={(gmail_user, user_valid) => this.setState({ gmail_user })}
              label={wording.user}
            />
            <InputRow
              defaultValue={gmail_pass}
              autoComplete="eventplanner_gmail_user"
              userInterface={userInterface.pass}
              onChange={(gmail_pass, pass_valid) => this.setState({ gmail_pass })}
              label={wording.password}
              type="password"
            />
          </div>
        </div>
        <div className="row justifyEnd">
          <button
            type="button"
            onClick={() => {
              this.setState({
                gmail_edit: false,
                gmail_user: instance.gmail_user || '',
                gmail_pass: instance.gmail_pass || '',
              })
              if (instance.gmail_user && userInterface.user.test(instance.gmail_user)) {
                validateGmail(this.props.instance.id)
              }
            }}
          >
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
    const { instance } = this.props
    const gmail_valid = true

    if (!gmail_user.length) {
      return (
        <div className="noConnection">
          <p className="info">{wording.noConnection}</p>
          <span className="fakeLink" onClick={() => this.setState({ gmail_edit: true, originalGmail_state: gmail_state })}>
            {wording.connectNow}
          </span>
        </div>
      )
    }

    return (
      <div className="textAlignCenter">
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
              <span className="fa fa-pencil edit marginLeft fakeLink" onClick={() => this.setState({ gmail_edit: true, originalGmail_state: gmail_state })} />
            </b>
          </span>
        </p>
      </div>
    )
  }
}
