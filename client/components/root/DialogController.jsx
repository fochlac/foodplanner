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

        switch(d.type) {
            case 'MEAL_EDIT':
                return <SignUpDialog type="edit" id={d.option.signup}/>;
            case 'MEAL_SIGNUP':
                return <SignUpDialog type="empty" id={d.option.meal}/>;
            case 'CREATE_MEAL':
                return <CreateMealDialog />;
            case 'EDIT_MEAL':
                return <CreateMealDialog type="edit" id={d.option.meal}/>;
            case 'OPEN_SETTINGS':
                return <SettingsDialog />;
            case 'CANCEL_MEAL':
                return <ConfirmationDialog message="Bist du dir sicher, dass du dieses Angebot löschen möchtest?" action="cancel_meal" parameter={[d.option.meal]} />;
            default:
                return null;
        }
    }
}