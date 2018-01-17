import React from 'react';
import { connect } from 'react-redux';
import Topbar from 'UI/Topbar.js';
import BusyScreen from 'UI/BusyScreen/BusyScreen.jsx';
import Error from 'UI/Error.js';
import DialogController from 'ROOT/DialogController.jsx';
import {resizeFocus, removeResizeFocus} from 'SCRIPTS/resizeFocus.js';
import { show_impressum, refresh } from 'ACTIONS';

export class DefaultPage extends React.Component {
    constructor(props) {
        super();

        this.refreshContent = this.refreshContent.bind(this);
    }

    refreshContent() {
        this.props.refresh(this.props.app.dataversion);
    }

    componentDidMount() {
        resizeFocus();
        window.addEventListener('focus', this.refreshContent);
    }

    componentWillUnmount() {
        removeResizeFocus();
        window.removeEventListener('focus', this.refreshContent);
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

const mapStateToProps = (state, ownProps) => ({
  dialog: ownProps.dialog,
  app: state.app,
  errors: state.app.errors
});

export default connect(mapStateToProps, { show_impressum, refresh })(DefaultPage);