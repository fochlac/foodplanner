import React from 'react';
import Topbar from '../ui/Topbar.js';
import BusyScreen from '../ui/BusyScreen/BusyScreen.jsx';
import DialogController from './DialogController.jsx';
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

    render() {
        return (<div>
            <Topbar/>
            {this.props.children}
            <DialogController dialog={this.props.dialog}/>
            <BusyScreen show={this.props.app.busy} />
            <div className="footer">
                <a href="https://github.com/ep-friedel/foodplanner/" target="_blank">Github</a>
                <div className="impressum pointer" onClick={this.props.show_impressum.bind(this)}>Impressum & Datenschutz</div>
            </div>
        </div>)
    }
}