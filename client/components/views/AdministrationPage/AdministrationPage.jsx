import './AdministrationPage.less'

import DefaultPage from 'UI/DefaultPage.js'
import React from 'react'

const wording = {}

export default class AdministrationPage extends React.Component {
  constructor(props) {
    super()

    this.state = {
      view: 'initial',
    }
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  render() {
    const { app, user, sign_out } = this.props

    return (
      <DefaultPage>
        <div className="topbar">
          <div className="spacer">
            <span className="fa fa-calender fa-lg" />
            <ul className="quicklinks">
              {app.hiddenBusy && app.dialog === '' ? (
                <li>
                  <span className="fa fa-refresh fa-spin fa-lg" />
                </li>
              ) : null}
              <li onClick={sign_out.bind(this, user.id)}>
                <span className="symbolExplanation">Abmelden</span>
                <span className="fa fa-sign-out fa-lg" title="Abmelden" />
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard landing">Hallo Welt</div>
      </DefaultPage>
    )
  }
}
