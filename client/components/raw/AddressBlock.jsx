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
                street: props.value.street || '',
                number: props.value.number || '',
                postal: props.value.postal || '',
                city: props.value.city || '',
                country: props.value.country || '',
            },
            dirty: [],
            isValid: true,
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
        return evt => {
            const { onChange } = this.props
            const { address } = this.state

            this.setState({
                address: {
                    ...address,
                    [field]: evt.target.value,
                }
            }, () => {
                if (onChange) {
                    const isValid = Object.keys(address).every(prop => addressInterface[prop].test(address[prop]))

                    onChange(address, isValid)
                }
            })
        }
    }

    handleBlur(field) {
        return () => {
            const { onBlur, userInterface } = this.props

            if (this.state.address[field].length || !this.state.dirty.includes(field)) {
                this.setState({ dirty: [...this.state.dirty, field] })
            }
            if (onBlur) {
                const { address } = this.state
                const isValid = Object.keys(address).every(prop => addressInterface[prop].test(address[prop]))
                
                onBlur(address, isValid)
            }
        }
    }

    render() {
        const { dirty } = this.state
        const { street, number, postal, city, country } = this.state.address
        const { required = true } = this.props

        return <div className="addressBlock colRowGrid">
            <div className="col alignStart">
                <div className="row">
                    <div className="basis66 alignStart">
                        <label className="noWrap" htmlFor="street">{wording.street}{required && <span className="fa fa-asterisk required"></span>}</label>
                        <input type="text" id="street" autoComplete="street-address" value={street} onChange={this.setStreet} className={dirty.includes('street') && !addressInterface.street.test(street) ? 'invalid' : ''} onBlur={this.dirtyStreet} />
                    </div>
                    <div className="basis33 alignStart">
                        <label className="noWrap" htmlFor="number">{wording.number}{required && <span className="fa fa-asterisk required"></span>}</label>
                        <input type="text" id="number" autoComplete="street-number" value={number} onChange={this.setNumber} className={dirty.includes('number') && !addressInterface.number.test(number) ? 'invalid' : ''} onBlur={this.dirtyNumber} />
                    </div>
                </div>
                <div className="row">
                    <div className="basis33 alignStart">
                        <label className="noWrap" htmlFor="postal">{wording.postal}{required && <span className="fa fa-asterisk required"></span>}</label>
                        <input type="text" id="postal" autoComplete="postal-code" value={postal} onChange={this.setPostal} className={dirty.includes('postal') && !addressInterface.postal.test(postal) ? 'invalid' : ''} onBlur={this.dirtyPostal} />
                    </div>
                    <div className="basis66 alignStart">
                        <label className="noWrap" htmlFor="city">{wording.city}{required && <span className="fa fa-asterisk required"></span>}</label>
                        <input type="text" id="city" autoComplete="address-level2 city" value={city} onChange={this.setCity} className={dirty.includes('city') && !addressInterface.city.test(city) ? 'invalid' : ''} onBlur={this.dirtyCity} />
                    </div>
                </div>
                <div className="fullWidth">
                    <label className="noWrap" htmlFor="country">{wording.country}{required && <span className="fa fa-asterisk required"></span>}</label>
                    <input type="text" id="country" autoComplete="country-name" value={country} onChange={this.setCountry} className={dirty.includes('country') && !addressInterface.country.test(country) ? 'invalid' : ''} onBlur={this.dirtyCountry} />
                </div>
            </div>
        </div>
    }
}