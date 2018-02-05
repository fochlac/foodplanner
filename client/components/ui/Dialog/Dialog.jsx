import './Dialog.less'

import React from 'react'

export default class Dialog extends React.Component {
  constructor() {
    super()

    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp(evt) {
    if (evt.keyCode === 27 && (!document.activeElement || !['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase()))) {
      this.props.close_dialog()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  closeDialog(evt) {
    if (evt.target.classList.contains('dialogBackground') && this.props.closeOnBackdrop) {
      this.props.close_dialog()
    }
  }

  render() {
    return (
      <div className="dialogBackground" onClick={this.closeDialog.bind(this)}>
        <div className={this.props.className ? this.props.className + ' dialog' : 'dialog'}>{this.props.children}</div>
      </div>
    )
  }
}
