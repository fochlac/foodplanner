import React from 'react';
import Dialog from '../Dialog/Dialog.jsx';
import { getNotificationPermission } from '../../scripts/serviceWorker.js';
import './SettingsDialog.less';

export default class SettingsDialog extends React.Component {
  constructor(props) {
    super();

    this.state = (props.user.mail ? {
          mailId: props.user.mailId,
          mail: props.user.mail,
          name: props.user.name ? props.user.name : '',
          creationNotice_mail: props.user.creationNotice ? props.user.creationNotice : 0,
          creationNotice_notification: props.user.creationNotice_notification ? props.user.creationNotice_notification : 0,
          deadlineReminder_mail: props.user.deadlineReminder ? props.user.deadlineReminder : 0,
          deadlineReminder_notification: props.user.deadlineReminder_notification ? props.user.deadlineReminder_notification : 0
        } : {
          mail: '',
          name: '',
          creationNotice_mail: 0,
          creationNotice_notification: 0,
          deadlineReminder_mail: 0,
          deadlineReminder_notification: 0
        });

    this.handleCheck = this.handleCheck.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
    this.mailInput = this.mailInput.bind(this);
    this.handleMailInput = this.handleMailInput.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.nameInput = this.handleInput('name').bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.mail && (nextProps.user.mail !== this.props.user.mail || this.state.allowUpdate)) {
      this.setState({
          mailId: nextProps.user.mailId,
          mail: nextProps.user.mail,
          name: nextProps.user.name ? nextProps.user.name : '',
          creationNotice_mail: nextProps.user.creationNotice ? nextProps.user.creationNotice : 0,
          creationNotice_notification: nextProps.user.creationNotice_notification ? nextProps.user.creationNotice_notification : 0,
          deadlineReminder_mail: nextProps.user.deadlineReminder ? nextProps.user.deadlineReminder : 0,
          deadlineReminder_notification: nextProps.user.deadlineReminder_notification ? nextProps.user.deadlineReminder_notification : 0,
          allowUpdate: false
        });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.app.mailSuggestion && !this.props.app.mailSuggestion && nextProps.app.mailSuggestion === this.state.mail) {
      return false;
    }
    return true;
  }

  submit() {
    const s = this.state;
    if (s.deadlineReminder_notification || s.creationNotice_notification) {
      getNotificationPermission()
        .then(() => {
          this.props.save_settings(this.state);
        })
        .catch(() => {
          // add error message
          this.setState({
            deadlineReminder_notification: 0,
            creationNotice_notification: 0
          });
        })
    } else {
      this.props.save_settings(this.state);
    }

  }

  cancel() {
    this.props.close_dialog();
  }

  selectSuggestion() {
    clearTimeout(this.hideTimeout);
    clearTimeout(this.showTimeout);
    this.timeout = false;
    this.setState({allowUpdate: true}, () => {
      this.props.select_suggestion(this.props.app.mailSuggestion);
    });
  }

  handleTab(evt) {
    if (evt.keyCode === 9 && this.props.app.mailSuggestion) {
      this.selectSuggestion();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  handleMailInput(evt) {
    const value = evt.target.value;
    this.setState({
      'mail': value
    }, () => {
      if (value.length > 4 && !this.timeout) {
        this.timeout = value;

        // check mail and block for 300ms
        this.showTimeout = setTimeout(() => {
          // clear blocker
          // check if mail changed during timeout; if so, recheck
          if (this.state.mail !== this.timeout) {
            this.timeout = false;
            this.handleMailInput({target: {value: this.state.mail}});
          } else {
            this.timeout = false;
          }
        }, 300);

        // hide suggestion after 3s
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
          this.props.hide_mail_suggestion();
        }, 4000);

        this.props.check_mail(value);
      } else {
        this.storedEmail = value;
      }
    });
  }

  mailInput() {
    return this.handleMailInput;
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
    const suggestion = (this.props.app.mailSuggestion ? this.props.app.mailSuggestion.mail : false),
          s = this.state,
          notificationsBlocked = Notification.permission === 'denied';
    return (
      <Dialog>
        <div className="titlebar">
          <h3>Einstellungen</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body settingsDialog">
          <div className="mailFrame row">
            <label htmlFor="SettingsDialog_mail">Email</label>
            <input type="text" id="SettingsDialog_mail" value={s.mail} onChange={this.mailInput()} onKeyDown={this.handleTab} autoComplete="off" />
            {
              suggestion
              ? <span className="mailSuggestion" onClick={this.selectSuggestion}>Mit Tab auswählen:<br/>{suggestion}</span>
              : null
            }
          </div>
          <div className="row">
            <label htmlFor="SettingsDialog_name">Name</label>
            <input type="text" id="SettingsDialog_name" value={s.name} onChange={this.nameInput}/>
          </div>
          <h4>Benachrichtigungen:</h4>
          <table className="notificationMatrix">
            <thead>
              <tr>
                <th>Ereignis</th>
                <th>Email</th>
                <th>Push-Nachricht</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Neues Angebot</td>
                <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'mail')} checked={this.state.creationNotice_mail}/></td>
                {
                  notificationsBlocked
                  ? <td><input type="checkbox" disabled="disabled" title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;Bitte lassen sie Benachrichtigungen zu, um diese Option wählen zu können." /></td>
                  : <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'notification')}  checked={this.state.creationNotice_notification}/></td>
                }
              </tr>
              <tr>
                <td>Anmeldungs&shy;frist läuft ab</td>
                <td><input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'mail')} checked={this.state.deadlineReminder_mail}/></td>
                {
                  notificationsBlocked
                  ? <td><input type="checkbox" disabled="disabled" title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;Bitte lassen sie Benachrichtigungen zu, um diese Option wählen zu können." /></td>
                  : <td><input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'notification')} checked={this.state.deadlineReminder_notification}/></td>
                }
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
