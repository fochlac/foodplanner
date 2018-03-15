import './BaseStyle.less'

import { removeResizeFocus, resizeFocus } from 'UTILS/resizeFocus.js'

import BusyScreen from 'UI/BusyScreen/BusyScreen.jsx'
import DialogController from './DialogController.jsx'
import Error from 'UI/Error.js'
import React from 'react'

export default class DefaultPage extends React.Component {
  componentDidMount() {
    resizeFocus()
  }

  componentWillUnmount() {
    removeResizeFocus()
  }

  render() {
    return (
      <div>
        {this.props.children}
        <DialogController dialog={this.props.app.dialog} />
        <div className="errors">{Object.keys(this.props.errors).map(error => <Error key={error} id={error} />)}</div>
        <BusyScreen show={this.props.app.busy} />
        <div className="footer">
          <a href="https://github.com/ep-friedel/foodplanner/" target="_blank">
            Github
          </a>
          <div className="impressum pointer" onClick={this.props.show_impressum.bind(this)}>
            Impressum & Datenschutz
          </div>
        </div>
      </div>
    )
  }
}
