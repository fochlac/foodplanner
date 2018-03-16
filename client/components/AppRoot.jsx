import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { apply_history, connect_serviceworker, convert_postmessage, initial_meals, initial_user } from 'STORE/actions.js'

import AdministrationPage from 'PAGES/AdministrationPage.js'
import Dashboard from 'PAGES/Dashboard.js'
import LandingPage from 'PAGES/LandingPage.js'
import React from 'react'
import { connect } from 'react-redux'
import { initDb } from 'UTILS/indexedDb.js'
import { initServiceWorker } from 'UTILS/serviceWorker.js'

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
    const { instance, user, app } = this.props
    return (
      <Router>
        <Switch>
          {(() => {
            switch (instance.page) {
              case 'instance':
                return [
                  <Route key="1" path={instance.isSubdomain ? '/unsubscribe' : `/${instance.id}/unsubscribe`} render={({ location }) => <Dashboard />} />,
                  <Route key="2" path={instance.isSubdomain ? '/' : `/${instance.id}/`} exact render={() => <Dashboard />} />,
                  history.state && history.state.app ? null : <Redirect key="3" to={instance.isSubdomain ? '/' : `/${instance.id}/`} />,
                  <Route key="4" path="/" render={() => <Dashboard />} />,
                ]
                break
              case 'landing':
                if (user.id && user.admin) {
                  // goto administration as soon as an admin logs in
                  return <Route path="/" render={() => <AdministrationPage />} />
                }
                return <Route path="/" render={() => <LandingPage />} />
            }
          })()}
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  app: state.app,
  instance: state.instance,
})

export default connect(mapStateToProps, { initial_meals, initial_user, connect_serviceworker, convert_postmessage, apply_history })(App)
