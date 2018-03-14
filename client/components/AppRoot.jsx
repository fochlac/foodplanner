import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { apply_history, connect_serviceworker, convert_postmessage, initial_meals, initial_user } from 'STORE/actions.js'

import Dashboard from 'PAGES/Dashboard.js'
import DefaultPage from 'UI/DefaultPage.js'
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
          <Route
            path="/unsubscribe"
            render={({ location }) => (
              <DefaultPage dialog={Object.assign({ type: 'UNSUBSCRIBE', location: location, user: user }, app.dialog)}>
                <Dashboard />
              </DefaultPage>
            )}
          />
          {(() => {
            switch (instance.page) {
              case 'instance':
                return [
                  <Route
                    path={instance.subdomain ? '/' : `/${instance.id}/`}
                    exact
                    render={() => (
                      <DefaultPage dialog={app.dialog}>
                        <Dashboard />
                      </DefaultPage>
                    )}
                  />,
                  history.state && history.state.app ? null : <Redirect to={instance.subdomain ? '/' : `/${instance.id}/`} />,
                  <Route
                    path="/"
                    render={() => (
                      <DefaultPage dialog={app.dialog}>
                        <Dashboard />
                      </DefaultPage>
                    )}
                  />,
                ]
                break
              case 'administration':
              case 'landing':
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
