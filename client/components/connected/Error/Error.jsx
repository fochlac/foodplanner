import './Error.less'

import React from 'react'

export default class Error extends React.Component {
  constructor(props) {
    super()

    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp(evt) {
    if (evt.keyCode === 27) {
      this.props.delete_error(this.props.id)
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  render() {
    return (
      <div className="error">
        <p>{this.props.error}</p>
        <span className="fa fa-times" onClick={this.props.delete_error.bind(this, this.props.id)} />
      </div>
    )
  }
}
