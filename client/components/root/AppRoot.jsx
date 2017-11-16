import React from 'react';
import {
      BrowserRouter as Router,
      Route,
      Redirect,
      Switch
    } from 'react-router-dom';

import DefaultPage from '../root/DefaultPage.jsx';
import Dashboard from '../pages/Dashboard.js';
import './BaseStyle.less';

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.props.initial_meals();

        if (localStorage.user) {
          this.props.initial_user(JSON.parse(localStorage.user));
        }
    }

    render() {
        return (<Router>
            <Switch>
                <Route exact path="/" render={() => <DefaultPage dialog={this.props.app.dialog}><Dashboard/></DefaultPage>} />
                <Redirect to="/" />
            </Switch>
        </Router>)
    }
}