import 'ROOT/BaseStyle.less'

import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { apply_history, connect_serviceworker, convert_postmessage, initial_meals, initial_user } from 'COMPONENTS/actions.js'

import Dashboard from 'PAGES/Dashboard.js'
import DefaultPage from 'ROOT/DefaultPage.jsx'
import React from 'react'
import { connect } from 'react-redux'
import { initDb } from 'SCRIPTS/indexedDb.js'
import { initServiceWorker } from 'SCRIPTS/serviceWorker.js'

class App extends React.Component {
  constructor(props) {
    super()
  }

  componentDidMount() {
    if (!window.defaultStore) {
      this.props.initial_meals()
    }
    initDb('food', 'userData')
      .then(db => db.get('user'))
      .then(user => {
        this.props.initial_user({
          creationNotice_notification: user.creationNotice_notification,
          deadlineReminder_notification: user.deadlineReminder_notification,
        })
      })
      .catch(console.log)

    initServiceWorker()
      .then(subscription => {
        this.props.connect_serviceworker(subscription)
      })
      .catch(console.log)

    navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', this.props.convert_postmessage.bind(this))

    window.addEventListener('popstate', evt => {
      evt.state && this.props.apply_history(evt.state)
    })

    if (history.state && history.state.app) {
      this.props.apply_history(history.state)
    } else {
      history.replaceState({ app: { ...this.props.app } }, document.title, document.location.pathname)
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/unsubscribe"
            render={({ location }) => (
              <DefaultPage dialog={Object.assign({ type: 'UNSUBSCRIBE', location: location, user: this.props.user }, this.props.app.dialog)}>
                <Dashboard />
              </DefaultPage>
            )}
          />
          <Route
            path="/"
            exact
            render={() => (
              <DefaultPage dialog={this.props.app.dialog}>
                <Dashboard />
              </DefaultPage>
            )}
          />
          {history.state && history.state.app ? null : <Redirect to="/" />}
          <Route
            path="/"
            render={() => (
              <DefaultPage dialog={this.props.app.dialog}>
                <Dashboard />
              </DefaultPage>
            )}
          />
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app,
})

export default connect(mapStateToProps, { initial_meals, initial_user, connect_serviceworker, convert_postmessage, apply_history })(App)
