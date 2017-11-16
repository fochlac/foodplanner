import React from 'react';
import Dialog from '../Dialog/Dialog.jsx';

export default class SettingsDialog extends React.Component {
  constructor(props) {
    super();

    this.state = (props.user.email ? {
          email: props.user.email,
          name: props.user.name ? props.user.name : '',
          creationNotice_email: props.user.creationNotice_email ? props.user.creationNotice_email : 0,
          creationNotice_notification: props.user.creationNotice_notification ? props.user.creationNotice_notification : 0,
          deadlineReminder_email: props.user.deadlineReminder_email ? props.user.deadlineReminder_email : 0,
          deadlineReminder_notification: props.user.deadlineReminder_notification ? props.user.deadlineReminder_notification : 0
        } : {
          email: '',
          name: '',
          creationNotice_email: 0,
          creationNotice_notification: 0,
          deadlineReminder_email: 0,
          deadlineReminder_notification: 0
        });

    this.handleCheck = this.handleCheck.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
    this.emailInput = this.emailInput.bind(this);
    this.nameInput = this.handleInput('name').bind(this);
  }

  submit() {
    const s = this.state;

    this.props.save_settings({
      mail: s.email,
      name: s.name,
      creationNotice_email: s.creationNotice_email,
      creationNotice_notification: s.creationNotice_notification,
      deadlineReminder_email: s.deadlineReminder_email,
      deadlineReminder_notification: s.deadlineReminder_notification
    });

    localStorage.user = JSON.stringify(this.state);
  }

  cancel() {
    this.props.close_dialog();
  }

  selectSuggestion() {
    this.props.select_suggestion(this.props.app.emailSuggestion);
  }

  emailInput() {
    return (evt) => {
      this.setState({
        'email': evt.target.value
      });

      if (evt.target.value.length > 4 && !this.timeout) {
        this.timeout = evt.target.value;
        setTimeout(() => {
          if (this.state.email !== this.timeout) {
            this.props.check_mail(this.storedEmail);
          }
          this.timeout = false;
        }, 300);
        this.props.check_mail(evt.target.value);
      } else {
        this.storedEmail = evt.target.value;
      }
    };
  }

  handleInput(field) {
    return (evt) => {
      this.setState({
        [field]: evt.target.value
      });
    };
  }

  handleCheck(event, type) {
    return (evt) => {
      this.setState({
        [event + '_' + type]: +evt.target.checked
      });
    };
  }

  render() {
    const suggestion = (this.props.app.emailSuggestion ? this.props.app.emailSuggestion.mail : false),
          s = this.state;

    return (
      <Dialog>
        <div className="titlebar">
          <h3>Einstellungen</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          <h2>NOT DONE</h2>
          <div>
            <label htmlFor="SettingsDialog_email">Email</label>
            <input type="text" id="SettingsDialog_email" defaultValue={s.email} onChange={this.emailInput()}/>
            {
              suggestion
              ? <span className="emailSuggestion" onClick={this.selectSuggestion}>{suggestion}</span>
              : null
            }
          </div>
          <div>
            <label htmlFor="SettingsDialog_name">Name</label>
            <input type="text" id="SettingsDialog_name" defaultValue={s.name} onChange={this.nameInput}/>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ereignis</th>
                <th>Email</th>
                <th>Notification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Neues Angebot</td>
                <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'email')}/></td>
                <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'notification')}/></td>
              </tr>
              <tr>
                <td>Anmeldungsfrist läuft ab</td>
                <td><input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'email')}/></td>
                <td><input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'notification')}/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="foot">
          <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button type="button" onClick={this.submit.bind(this)}>Bestätigen</button>
        </div>
      </Dialog>
    );
  }
}
