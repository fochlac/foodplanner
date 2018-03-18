import './LandingPage.less'

import DefaultPage from 'UI/DefaultPage.js'
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'
import { generateHash } from 'UTILS/crypto.js'

const wording = {
  title: 'TerminPlanner',
  intro: 'Sichern sie sich jetzt ihren Wunschnamen!',
  text: [],
  findDomain: 'Domain sichern',
  submit: 'Abschicken',
  domainFinderTitle: 'Wunschdomain',
  isFree: 'ist noch frei!',
  street: 'Mittagsweg 5',
  city: '12345 Essen',
  germany: 'Deutschland',
  email: 'E-Mail Addresse',
  address: 'Addresse',
  name: 'Name',
  company: 'Firma',
  password: 'Passwort',
  passwordRepeat: 'Passwort wiederholen',
  nameInfo:
    'Bit\u00ADte geb\u00ADen Sie min\u00ADdes\u00ADtens 2 Zei\u00ADchen ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Binde\u00ADstrich und Leer\u00ADzei\u00ADchen sind er\u00ADlaubt.',
  mailInfo:
    'Bit\u00ADte geb\u00ADen Sie eine val\u00ADide Email-Ad\u00ADdres\u00ADse ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Punkt, Binde\u00ADstrich und Un\u00ADter\u00ADstrich sind er\u00ADlaubt.',
  passInfo:
    "Bit\u00ADte geb\u00ADen Sie ein val\u00ADides Pass\u00ADwort ein. Neben Buch\u00ADsta\u00ADben und Zahl\u00ADen sind fol\u00ADgen\u00ADde Son\u00ADder\u00ADzei\u00ADchen er\u00ADlaubt: .-,|;:_#'+*~?=(/&%$§!)",
}
export const userInterface = {
  name: name => /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/.test(name),
  subdomain: subdomain => /^[A-Za-z0-9-_]{4,100}$/.test(subdomain),
  mail: mail => /^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/.test(mail),
  pass: pass => /^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{0,100}$/.test(pass),
}

export default class LandingPage extends React.Component {
  constructor(props) {
    super()

    this.state = {
      view: 'initial',
      subdomain: '',
      pass: '',
      pass2: '',
    }
    this.nameInput = this.handleInput('name').bind(this)
    this.emailInput = this.handleInput('mail').bind(this)
    this.companyInput = this.handleInput('company').bind(this)
    this.address1Input = this.handleInput('address1').bind(this)
    this.address2Input = this.handleInput('address2').bind(this)
    this.address3Input = this.handleInput('address3').bind(this)
    this.passInput = this.handleInput('pass').bind(this)
    this.pass2Input = this.handleInput('pass2').bind(this)

    this.subdomainInput = this.handleSubdomain.bind(this)
  }

  handleInput(field) {
    return evt => {
      this.setState({
        [field]: evt.target.value,
      })
    }
  }

  handleSubdomain(evt) {
    const subdomain = evt.target.value
    clearTimeout(this.subdomainCheck)
    this.setState({ subdomain })
    if (userInterface.subdomain(subdomain)) {
      this.subdomainCheck = setTimeout(() => {
        this.props.checkDomain(subdomain)
      }, 300)
    }
  }

  submit() {
    const { name, mail, company, address, address2, address3, pass, pass2, subdomain } = this.state
    const valid = userInterface.mail(mail) && userInterface.name(name) && (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass)
    if (!valid) {
      return
    }

    generateHash(pass)
      .then(hash => {
        this.props.createInstance({
          name,
          mail,
          hash,
          subdomain,
          company,
          address: JSON.stringify({
            1: address,
            2: address2,
            3: address3,
          }),
        })
      })
      .catch(console.log)
  }

  renderInitial() {
    const { subdomain, hiddenBusy, busyList } = this.props.app
    return [
      <div key="1" className="SliderGallery" />,
      <div key="2" className="content">
        <h2 className="title">{wording.title}</h2>
        <h3 className="title">{wording.intro}</h3>
        <div className="domainFinder">
          <h3>{wording.domainFinderTitle}</h3>
          <div className="spinnerInside domainInput">
            <input type="text" onChange={this.subdomainInput} />
            <span>.fochlac.com</span>
            {hiddenBusy && busyList.includes('domainCheck') && <div className="fa fa-spin fa-spinner fa-lg" />}
          </div>
          <button onClick={() => this.setState({ view: 'register' })} disabled={!(subdomain && subdomain.isValid && subdomain.name === this.state.subdomain)}>
            {wording.findDomain}
          </button>
        </div>
        {wording.text.map((text, index) => <p key={index}>{text}</p>)}
      </div>,
    ]
  }

  renderRegister() {
    const { name, mail, company, address, address2, address3, pass, pass2, subdomain } = this.state

    const valid = userInterface.mail(mail) && userInterface.name(name) && (userInterface.pass(pass) && userInterface.pass(pass2) && pass2 === pass)
    const passwordValid = pass2 === pass.slice(0, pass2.length) || (pass === pass2 && userInterface.pass(pass))

    return (
      <div className="content">
        <h2 className="title">{wording.title}</h2>
        <h3 className="title">
          <u>https://{subdomain}.fochlac.com</u>
          <span> {wording.isFree}</span>
        </h3>
        <form>
          <div>
            <label htmlFor="Landing_name">
              {wording.name}
              <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                {wording.nameInfo}
              </InfoBubble>
            </label>
            <input type="text" id="Landing_name" defaultValue={name} autoComplete="name" onChange={this.nameInput} />
          </div>
          <div>
            <label htmlFor="Landing_email">
              {wording.email}
              <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                {wording.mailInfo}
              </InfoBubble>
            </label>
            <input type="text" id="Landing_email" defaultValue={mail} autoComplete="email" onChange={this.emailInput} />
          </div>
          <div>
            <label htmlFor="Landing_company">{wording.company}</label>
            <input type="text" id="Landing_company" defaultValue={company} autoComplete="company" onChange={this.companyInput} />
          </div>
          <div>
            <label htmlFor="Landing_address">{wording.address}</label>
            <input
              type="text"
              id="Landing_address"
              defaultValue={address}
              autoComplete="street-address"
              placeholder={wording.street}
              onChange={this.address1Input}
            />
            <input
              type="text"
              id="Landing_address2"
              defaultValue={address2}
              autoComplete="postal-code"
              placeholder={wording.city}
              onChange={this.address2Input}
            />
            <input
              type="text"
              id="Landing_address3"
              defaultValue={address3}
              autoComplete="country"
              placeholder={wording.germany}
              onChange={this.address3Input}
            />
          </div>
          <label htmlFor="Landing_pass">
            {wording.password}
            <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
              {wording.passInfo}
            </InfoBubble>
          </label>
          <input
            id="Landing_pass"
            className={'pass' + (!passwordValid ? ' invalid' : '')}
            type="password"
            onChange={this.passInput}
            defaultValue={pass}
            autoComplete="new-password"
          />
          {pass.length ? (
            <span>
              <label htmlFor="Landing_pass2">
                {wording.passwordRepeat}
                <InfoBubble style={{ bottom: '28px', left: '-80px', width: '160px' }} symbol="fa-asterisk required" arrow="top">
                  {wording.passInfo}
                </InfoBubble>
              </label>
              <input
                id="Landing_pass2"
                className={'pass' + (!passwordValid ? ' invalid' : '')}
                type="password"
                onChange={this.pass2Input}
                defaultValue={pass2}
                autoComplete="new-password"
              />
            </span>
          ) : null}
          <button type="button" onClick={() => this.submit()} disabled={!valid} style={{ width: '100%' }}>
            {wording.submit}
          </button>
        </form>
      </div>
    )
  }

  render() {
    const { app, user, sign_out, start_sign_in } = this.props

    return (
      <DefaultPage>
        <div className="topbar">
          <div className="spacer">
            <span className="fa fa-calendar fa-lg" />
            <ul className="quicklinks">
              {app.hiddenBusy && app.dialog === '' ? (
                <li>
                  <span className="fa fa-refresh fa-spin fa-lg" />
                </li>
              ) : null}

              {user.id ? (
                <li onClick={sign_out.bind(this, user.id)}>
                  <span className="symbolExplanation">Abmelden</span>
                  <span className="fa fa-sign-out fa-lg" title="Abmelden" />
                </li>
              ) : (
                <li onClick={start_sign_in.bind(this, { hideRegister: true })}>
                  <span className="symbolExplanation">Anmelden</span>
                  <span className="fa fa-sign-in fa-flip-horizontal fa-lg" title="Anmelden" />
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="dashboard landing">{this.state.view === 'initial' ? this.renderInitial() : this.renderRegister()}</div>
      </DefaultPage>
    )
  }
}
