import React from 'react';
import Dialog from '../Dialog.js';
import { getNotificationPermission } from '../../scripts/serviceWorker.js';
import './SettingsDialog.less';

export default class SettingsDialog extends React.Component {
  constructor(props) {
    super();

    this.state = {
          id: props.user.id,
          mail: props.user.mail ? props.user.mail : '',
          name: props.user.name ? props.user.name : '',
          creationNotice_mail: props.user.creationNotice ? props.user.creationNotice : 0,
          creationNotice_notification: props.user.creationNotice_notification ? props.user.creationNotice_notification : 0,
          deadlineReminder_mail: props.user.deadlineReminder ? props.user.deadlineReminder : 0,
          deadlineReminder_notification: props.user.deadlineReminder_notification ? props.user.deadlineReminder_notification : 0
        };

    this.handleCheck = this.handleCheck.bind(this);
    this.mailInput = this.handleInput('mail').bind(this);
    this.nameInput = this.handleInput('name').bind(this);
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
          if (location.href !== location.origin) {
            history.pushState({}, "Mittagsplaner", location.origin);
          }
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
      if (location.href !== location.origin) {
        history.pushState({}, "Mittagsplaner", location.origin);
      }
      this.props.save_settings(this.state);
    }

  }

  cancel() {
    this.props.close_dialog();
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
    const s = this.state,
          notificationsBlocked = Notification.permission === 'denied';

    return (
      <Dialog className="settingsDialog">
        <div className="titlebar">
          <h3>Einstellungen</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          {
            this.props.user.id
            ? <div className="mailFrame">
              <label htmlFor="SettingsDialog_mail">E-Mail</label>
              <div className="row">
                <input type="text" id="SettingsDialog_mail" value={s.mail} onChange={this.mailInput} autoComplete="off" />
                <span className={'fa fa-lg fa-fw fa-spin fa-spinner' + (this.props.app.hiddenBusy ? '' : ' invisible')}></span>
              </div>
            </div>
            : null
          }
          <div>
            <label htmlFor="SettingsDialog_name">Name</label>
            <input type="text" id="SettingsDialog_name" value={s.name} onChange={this.nameInput}/>
          </div>
          <h4>Benachrichtigungen:</h4>
          <table className="notificationMatrix">
            <thead>
              <tr>
                <th>Ereignis</th>
                <th>E-Mail</th>
                <th>Push-Nachricht<span className="fa fa-info-circle" title="Die Einstellungen für Push-Nachrichten gelten jeweils&#13;&#10;nur für das Gerät, auf dem sie ausgewählt wurden."></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Neues Angebot</td>
                {
                  !this.props.user.id
                  ? <td><input type="checkbox" disabled="disabled" title="Bitte registrieren Sie sich, um diese Option wählen zu können." /></td>
                  : <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'mail')} checked={this.state.creationNotice_mail}/></td>
                }
                {
                  notificationsBlocked
                  ? <td><input type="checkbox" disabled="disabled" title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;&#10;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können." /></td>
                  : <td><input type="checkbox" onChange={this.handleCheck('creationNotice', 'notification')}  checked={this.state.creationNotice_notification}/></td>
                }
              </tr>
              <tr>
                <td>Anmeldungs&shy;frist läuft ab</td>
                {
                  !this.props.user.id
                  ? <td><input type="checkbox" disabled="disabled" title="Bitte registrieren Sie sich, um diese Option wählen zu können." /></td>
                  : <td><input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'mail')} checked={this.state.deadlineReminder_mail}/></td>
                }
                {
                  notificationsBlocked
                  ? <td><input type="checkbox" disabled="disabled" title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können." /></td>
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
