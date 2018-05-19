import React from 'react'
import { getData } from 'UTILS/parseSettings'

const FormContext = React.createContext('form')

export const FormConnector = Component => {
  return class extends React.Component {
    render() {
      const { myKey } = this.props

      console.log(this.props)

      return (
        <FormContext.Consumer>
          {context => <Component {...this.props} data={getData(context.data, myKey)} onChange={context.setValue(myKey)} submit={context.submit} />}
        </FormContext.Consumer>
      )
    }
  }
}

export default class JSONForm extends React.Component {
  constructor(props) {
    super()

    this.state = {
      data: props.data || {},
    }
  }

  setValue(key) {
    return value => {
      const { data } = this.state
      this.setState({ data: { ...data, [key]: value } })
    }
  }

  submit() {
    const { submitForm, url, method } = this.props
    submitForm({ url, method }, this.state.data)
  }

  render() {
    const { children, data } = this.props

    return (
      <FormContext.Provider value={{ data, setValue: this.setValue.bind(this), submit: this.submit.bind(this) }}>
        <div>{children}</div>
      </FormContext.Provider>
    )
  }
}
