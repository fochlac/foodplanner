import React from 'react';
import Topbar from '../ui/Topbar.js';
import SignUpDialog from '../ui/SignUpDialog.js';
import {resizeFocus, removeResizeFocus} from '../scripts/resizeFocus.js';

export default class DefaultPage extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        resizeFocus();
    }

    componentWillUnmount() {
        removeResizeFocus();
    }

    renderDialog() {
        const d = this.props.dialog;

        switch(d.type) {
            case 'LOGIN':
            case 'MEAL_EDIT':
                return <SignUpDialog type="edit" id={d.option.signup}/>;
            case 'MEAL_SIGNUP':
                return <SignUpDialog type="empty" id={d.option.meal}/>;
            default:
                return null;
        }
    }

    render() {
        return (<div>
            <Topbar/>
            {this.props.children}
            {this.renderDialog()}
        </div>)
    }
}