import React from 'react'

const wording = {
  title: 'Seitenüberschrift',
  gmail: 'Google Mail - Benutzerdaten',
  password: 'Passwort',
  user: 'Benutzername',
  icon: 'Icon',
  submit: 'Speichern',
}

export default class GeneralAdministration extends React.Component {
  constructor({ instance }) {
    super()

    this.state = {
      title: instance.title || '',
      icon: instance.icon || '',
      gmail_user: instance.gmail_user || '',
      gmail_pass: instance.gmail_pass || '',
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
    })
  }

  handleInput(field) {
    return evt => {
      this.setState({ [field]: evt.target.value })
    }
  }

  render() {
    const { title, icon, gmail_user, gmail_pass } = this.state
    const valid = true

    return (
      <div>
        <form>
          <div>
            <label htmlFor="General_Admin_title">{wording.title}</label>
            <input type="text" id="General_Admin_title" value={title} onChange={this.titleInput} />
          </div>
          <div>
            <label htmlFor="General_Admin_icon">{wording.icon}</label>
            <input type="text" id="General_Admin_icon" value={icon} onChange={this.iconInput} />
          </div>
          <h4>{wording.gmail}</h4>
          <div>
            <label htmlFor="General_Admin_guser">{wording.user}</label>
            <input type="text" id="General_Admin_guser" value={gmail_user} onChange={this.guserInput} />
          </div>
          <div>
            <label htmlFor="General_Admin_gpass">{wording.password}</label>
            <input type="password" id="General_Admin_gpass" value={gmail_pass} onChange={this.gpassInput} />
          </div>
          <button type="button" onClick={() => this.submit()} disabled={!valid} style={{ width: '100%' }}>
            {wording.submit}
          </button>
        </form>
      </div>
    )
  }
}
