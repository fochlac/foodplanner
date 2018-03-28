import InputRow from 'RAW/InputRow.jsx'
import React from 'react'

const wording = {
  street: 'Straße',
  number: 'Hausnummer',
  postal: 'Postleitzahl',
  city: 'Stadt',
  country: 'Land',
}

const addressInterface = {
  street: /[A-Za-z\-\_\.\s]{3,50}/,
  number: /[0-9]{1,10}/,
  postal: /[0-9A-Za-z\-\s]{3,10}/,
  city: /[A-Za-z\-\_\.\s]{3,50}/,
  country: /[A-Za-z\-\_\.\s]{3,50}/,
}

export default class AddressBlock extends React.Component {
  constructor(props) {
    super()

    this.state = {
      address: {
        street: (props.value && props.value.street) || '',
        number: (props.value && props.value.number) || '',
        postal: (props.value && props.value.postal) || '',
        city: (props.value && props.value.city) || '',
        country: (props.value && props.value.country) || '',
      },
      dirty: [],
      isValid: props.value && Object.keys(props.value).every(prop => addressInterface[prop].test(props.value[prop])),
    }

    this.setStreet = this.handleInput('street').bind(this)
    this.setNumber = this.handleInput('number').bind(this)
    this.setPostal = this.handleInput('postal').bind(this)
    this.setCity = this.handleInput('city').bind(this)
    this.setCountry = this.handleInput('country').bind(this)

    this.dirtyStreet = this.handleBlur('street').bind(this)
    this.dirtyNumber = this.handleBlur('number').bind(this)
    this.dirtyPostal = this.handleBlur('postal').bind(this)
    this.dirtyCity = this.handleBlur('city').bind(this)
    this.dirtyCountry = this.handleBlur('country').bind(this)
  }

  handleInput(field) {
    return (value, valid) => {
      const { onChange } = this.props
      const { address, isValid } = this.state
      const newAddress = {
        ...address,
        [field]: value,
      }
      const newValid = (isValid && valid) || (valid && Object.keys(newAddress).every(prop => addressInterface[prop].test(newAddress[prop])))

      this.setState(
        {
          address: newAddress,
          isValid: newValid,
        },
        () => {
          onChange && onChange(newAddress, newValid)
        },
      )
    }
  }

  handleBlur(field) {
    return () => {
      const { onBlur } = this.props

      if (onBlur) {
        const { address, isValid } = this.state

        onBlur(address, isValid)
      }
    }
  }

  render() {
    const { dirty } = this.state
    const { street, number, postal, city, country } = this.state.address
    const { required = true } = this.props

    return (
      <div className="addressBlock colRowGrid">
        <div className="col alignStart">
          <div className="row">
            <InputRow
              className="basis66 alignStart"
              label={wording.street}
              defaultValue={street}
              required={required}
              autoComplete="street-address"
              userInterface={addressInterface.street}
              onChange={this.setStreet}
              onBlur={this.dirtyStreet}
            />
            <InputRow
              className="basis33 alignStart"
              label={wording.number}
              defaultValue={number}
              required={required}
              autoComplete="street-number"
              userInterface={addressInterface.number}
              onChange={this.setNumber}
              onBlur={this.dirtyNumber}
            />
          </div>
          <div className="row">
            <InputRow
              className="basis33 alignStart"
              label={wording.postal}
              defaultValue={postal}
              required={required}
              autoComplete="postal-code"
              userInterface={addressInterface.postal}
              onChange={this.setPostal}
              onBlur={this.dirtyPostal}
            />
            <InputRow
              className="basis66 alignStart"
              label={wording.city}
              defaultValue={city}
              required={required}
              userInterface={addressInterface.city}
              autoComplete="address-level2 city"
              onChange={this.setCity}
              onBlur={this.dirtyCity}
            />
          </div>
          <InputRow
            label={wording.country}
            defaultValue={country}
            required={required}
            userInterface={addressInterface.city}
            autoComplete="country-name"
            onChange={this.setCountry}
            onBlur={this.dirtyCountry}
          />
        </div>
      </div>
    )
  }
}
