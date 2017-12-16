import React from 'react';
import {
      BrowserRouter as Router,
      Route,
      Redirect,
      Switch
    } from 'react-router-dom';

import DefaultPage              from 'ROOT/DefaultPage.js';
import { initServiceWorker }    from 'SCRIPTS/serviceWorker.js';
import { initDb }               from 'SCRIPTS/indexedDb.js';
import Dashboard                from 'PAGES/Dashboard.js';
import 'ROOT/BaseStyle.less';

import { connect } from 'react-redux';
import { initial_meals, initial_user, connect_serviceworker, convert_postmessage, apply_history } from 'COMPONENTS/actions.js';

class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        if (!window.defaultStore) {
            this.props.initial_meals();
        }
        initDb('food', 'userData')
            .then(db => db.get('user'))
            .then(user => {
                if (user.id) {
                    this.props.initial_user(user.id, {
                        creationNotice_notification: user.creationNotice_notification, 
                        deadlineReminder_notification: user.deadlineReminder_notification
                    });
                }
            })
            .catch(console.log);

        initServiceWorker()
            .then(subscription => {
                this.props.connect_serviceworker(subscription);
            })

        navigator.serviceWorker.addEventListener('message', this.props.convert_postmessage.bind(this));

        window.addEventListener('popstate', (evt) => {
            this.props.apply_history(evt.state);
        });
    }

    render() {
        return (<Router>
            <Switch>
                <Route path="/unsubscribe" render={({location}) => <DefaultPage dialog={Object.assign({type: "UNSUBSCRIBE", location: location, user: this.props.user}, this.props.app.dialog)}><Dashboard/></DefaultPage>} />
                <Route path="/" exact render={() => <DefaultPage dialog={this.props.app.dialog}><Dashboard/></DefaultPage>} />
                {
                    (history.state && history.state.app)
                    ? null
                    : <Redirect to="/" />
                }
                <Route path="/" render={() => <DefaultPage dialog={this.props.app.dialog}><Dashboard/></DefaultPage>} />
            </Switch>
        </Router>)
    }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app
});

export default connect(mapStateToProps, { initial_meals, initial_user, connect_serviceworker, convert_postmessage, apply_history })(App);