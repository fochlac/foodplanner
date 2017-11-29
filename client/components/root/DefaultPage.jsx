import React from 'react';
import Topbar from '../ui/Topbar.js';
import BusyScreen from '../ui/BusyScreen/BusyScreen.jsx';
import Error from '../ui/Error.js';
import DialogController from './DialogController.jsx';
import {resizeFocus, removeResizeFocus} from '../scripts/resizeFocus.js';

export default class DefaultPage extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.initial_meals = this.props.initial_meals.bind(this, true);
        resizeFocus();
        window.addEventListener('focus', this.initial_meals);
    }

    componentWillUnmount() {
        removeResizeFocus();
        window.removeEventListener('focus', this.initial_meals);
    }

    render() {
        return (<div>
            <Topbar/>
            {this.props.children}
            <DialogController dialog={this.props.dialog}/>
            <div className="errors">
                {Object.keys(this.props.errors).map(error => <Error key={error} id={error} />)}
            </div>
            <BusyScreen show={this.props.app.busy} />
            <div className="footer">
                <a href="https://github.com/ep-friedel/foodplanner/" target="_blank">Github</a>
                <div className="impressum pointer" onClick={this.props.show_impressum.bind(this)}>Impressum & Datenschutz</div>
            </div>
        </div>)
    }
}