import React from 'react';
import {
      BrowserRouter as Router,
      Route,
      Redirect,
      Switch
    } from 'react-router-dom';

import Login from '../pages/Login.jsx';
import DefaultPage from '../root/DefaultPage.jsx';
import Dashboard from '../pages/Dashboard.js';
import Admin from '../pages/Admin.js';
import './BaseStyle.less';

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.props.initial_signups();
    }

    render() {
        return (<Router>
                {!this.props.login
                    ?
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Login} />
                        <Redirect to="/login" />
                    </Switch>
                    :
                    <Switch>
                        <Route exact path="/" render={() => <DefaultPage dialog={this.props.app.dialog}><Dashboard/></DefaultPage>} />
                        <Route exact path="/admin/:id" render={({match}) => <DefaultPage dialog={this.props.app.dialog}><Admin id={match.params.id}/></DefaultPage>} />
                        <Redirect to="/" />
                    </Switch>
                }
        </Router>)
    }
}