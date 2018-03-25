import React from 'react'

import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import AddressBlock from 'UI/AddressBlock/AddressBlock.jsx'

const wording = {
  submit: 'Abschicken',
  address: 'Addresse',
  name: 'Name',
  company: 'Firma',
  nameInfo:
    'Bit\u00ADte geb\u00ADen Sie min\u00ADdes\u00ADtens 2 Zei\u00ADchen ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Binde\u00ADstrich und Leer\u00ADzei\u00ADchen sind er\u00ADlaubt.',
}

export const userInterface = {
  name: name => /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/.test(name),
}

export default class InstanceAdministration extends React.Component {
  constructor({ instance }) {
    super()

    this.state = {}

    this.nameInput = this.handleInput('name').bind(this)
    this.companyInput = this.handleInput('company').bind(this)
  }

  componentWillReceiveProps({ instance }) {
    this.setState({
      title: instance.title,
      icon: instance.icon,
      gmail_user: instance.gmail_user,
      gmail_pass: instance.gmail_pass,
    })
  }

  handleInput(field) {
    return evt => {
      this.setState({ [field]: evt.target.value })
    }
  }

  render() {
    const { name, company, address, addressValid } = this.state

    return (
      <div className="colRowGrid">
        <div className="row justifyCenter">
          <div className="col basis300">
            <h4>{wording.address}</h4>
            <div className="fullWidth">
              <label htmlFor="Landing_name">
                {wording.name}
                <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                  {wording.nameInfo}
                </InfoBubble>
              </label>
              <input type="text" id="Landing_name" defaultValue={name} autoComplete="name" onChange={this.nameInput} />
            </div>
            <div className="fullWidth">
              <label htmlFor="Landing_company">{wording.company}</label>
              <input type="text" id="Landing_company" defaultValue={company} autoComplete="company" onChange={this.companyInput} />
            </div>
            <div>
              <AddressBlock onChange={(address, isValid) => this.setState({ address, addressValid: isValid })} value={{}} />
            </div>
            <div className="row">
              <button type="button" onClick={() => this.submit()} disabled={!(addressValid)} className="submit">
                {wording.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
