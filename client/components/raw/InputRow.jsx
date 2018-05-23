import React from 'react'

export default class InputRow extends React.Component {
  constructor(props) {
    super()

    this.state = {
      value: props.defaultValue || '',
      dirty: false,
      isValid: true,
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleInput({ target }) {
    const { onChange, userInterface = /.*/ } = this.props

    this.setState({ value: target.value }, () => {
      if (onChange) {
        const { value } = this.state
        const { valid } = this.props
        const isValid = valid !== undefined ? valid : userInterface.test(value.trim())

        onChange(value.trim(), isValid)
      }
    })
  }

  handleBlur() {
    const { onBlur, userInterface = /.*/ } = this.props

    if (this.state.value.length || !this.state.dirty) {
      this.setState({ dirty: true })
    }
    if (onBlur) {
      const { value } = this.state
      const { valid } = this.props
      const isValid = valid !== undefined ? valid : userInterface.test(value.trim())

      onBlur(value.trim(), isValid)
    }
  }

  render() {
    const { dirty, value } = this.state
    const {
      className = 'fullWidth',
      required = true,
      userInterface = /.*/,
      autoComplete,
      id = `input_${Math.floor(Date.now() * Math.random())}`,
      label,
      type = 'text',
      valid,
      placeholder,
    } = this.props

    return (
      <div className={className}>
        {label && (
          <label className="noWrap" htmlFor={id}>
            {label}
            {required && <span className="fa fa-asterisk required" />}
          </label>
        )}
        <input
          type={type}
          id={id}
          autoComplete={autoComplete}
          value={value}
          onChange={this.handleInput}
          className={(valid !== undefined ? !valid : dirty && !userInterface.test(value.trim())) ? 'invalid' : ''}
          onBlur={this.handleBlur}
          placeholder={placeholder}
        />
      </div>
    )
  }
}
