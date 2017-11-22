import React from 'react';
import SignUpDialog from '../ui/SignUpDialog.js';
import CreateMealDialog from '../ui/CreateMealDialog.js';
import ConfirmationDialog from '../ui/ConfirmationDialog.js';
import SettingsDialog from '../ui/SettingsDialog.js';

export default class DialogController extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        const d = this.props.dialog;
        let search, queries, params, message;

        if (d.location) {
            search = d.location.search.slice(1);
            queries = search.split('&');
            params = queries.reduce((acc, param) => {
                let keyval = param.split('=');
                acc[decodeURIComponent(keyval[0])] = decodeURIComponent(keyval[1]);

                return acc;
            },{});
        }

        switch(d.type) {
            case 'MEAL_EDIT':
                return <SignUpDialog type="edit" id={d.option.signup}/>;

            case 'MEAL_SIGNUP':
                return <SignUpDialog type="empty" id={d.option.meal}/>;

            case 'CREATE_MEAL':
                return <CreateMealDialog />;

            case 'EDIT_MEAL':
                return <CreateMealDialog type="edit" id={d.option.meal}/>;

            case 'SUBSCRIBE':
                return <SettingsDialog predef={params}/>;

            case 'UNSUBSCRIBE':
                if (params.list) {
                    message = `Erfolgreich von Emails ${(params.list === 'deadlineReminder') ? 'zur Erinnerung bei Ablauf der Anmeldefrist' : 'zur Benachrichtigung bei einem neuem Angebot'} abgemeldet.`;
                    params = Object.assign({}, d.user, {[params.list]: 0});

                } else {
                    message = "Erfolgreich von allen E-Mail-Benachrichtigungen abgemeldet.";
                    params = Object.assign({}, d.user, {creationNotice: 0, deadlineReminder: 0});
                }

                return <ConfirmationDialog message={message} action="save_settings_locally" parameter={[params]} noCancel={true}/>;
            case 'OPEN_SETTINGS':
                return <SettingsDialog />;

            case 'CANCEL_MEAL':
                return <ConfirmationDialog message="Bist du dir sicher, dass du dieses Angebot löschen möchtest?" action="cancel_meal" parameter={[d.option.meal]} />;

            default:
                return null;
        }
    }
}
