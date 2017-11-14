import './LandingPage.less'

import AddressBlock from 'RAW/AddressBlock.jsx'
import DefaultPage from 'CONNECTED/DefaultPage.js'
import InfoBubble from 'RAW/InfoBubble.jsx'
import InputRow from 'RAW/InputRow.jsx'
import React from 'react'
import { generateHash } from 'UTILS/crypto.js'

const wording = {
  planner: 'TerminPlanner',
  intro: 'Sichern sie sich jetzt ihren Wunschnamen!',
  title: 'Überschrift',
  cancel: 'Zurück',
  instance: 'Allgemein',
  findDomain: 'Domain sichern',
  submit: 'Abschicken',
  domainFinderTitle: 'Wunschdomain',
  isFree: 'ist noch frei!',
  email: 'E-Mail Addresse',
  address: 'Addresse',
  userData: 'Anmeldedaten',
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
  name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
  subdomain: /^[A-Za-z0-9-_]{4,100}$/,
  company: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{0,100}$/,
  mail: /^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/,
  pass: /^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{3,100}$/,
}

export default class LandingPage extends React.Component {
  constructor(props) {
    super()

    this.state = {
      view: props.instance.usesProxy ? 'initial' : 'register',
      subdomain: '',
      company: '',
      pass: '',
      pass2: '',
    }

    this.subdomainInput = this.handleSubdomain.bind(this)
  }


  handleSubdomain(evt) {
    const subdomain = evt.target.value
    clearTimeout(this.subdomainCheck)
    this.setState({ subdomain })
    if (userInterface.subdomain.test(subdomain)) {
      this.subdomainCheck = setTimeout(() => {
        this.props.checkDomain(subdomain)
      }, 300)
    }
  }

  submit() {
    const { name, mail, company, address, pass, pass2, subdomain, addressValid } = this.state
    const valid = userInterface.mail.test(mail) && userInterface.name.test(name) && (userInterface.pass.test(pass) && pass2 === pass) && addressValid
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
          address: JSON.stringify(address),
        })
      })
      .catch(console.log)
  }

  renderInitial() {
    const { subdomain, hiddenBusy, busyList } = this.props.app
    return [
      <div key="1" className="SliderGallery" />,
      <div key="2" className="content">
        <h2 className="title">{wording.planner}</h2>
        <h3 className="title">{wording.intro}</h3>
        <div className="domainFinder">
          <h3>{wording.domainFinderTitle}</h3>
          <div className="domainInput">
            <span className="spinnerInside">
              <input type="text" onChange={this.subdomainInput} />
              {hiddenBusy && busyList.includes('domainCheck') && <div className="fa fa-spin fa-spinner fa-lg" />}
            </span>
            <span>.fochlac.com</span>
          </div>
          <button onClick={() => this.setState({ view: 'register' })} disabled={!(subdomain && subdomain.isValid && subdomain.name === this.state.subdomain)}>
            {wording.findDomain}
          </button>
        </div>
      </div>,
    ]
  }

  renderRegister() {
    const { name, mail, company, address, pass, pass2, subdomain, addressValid } = this.state
    const { instance } = this.props

    const valid = userInterface.mail.test(mail) && userInterface.name.test(name) && (userInterface.pass.test(pass) && pass2 === pass) && addressValid
    const passwordValid = pass2 === pass.slice(0, pass2.length) || (pass === pass2 && userInterface.pass.test(pass))

    return (
      <div className="content">
        <h2 className="title">{wording.planner}</h2>
        {instance.usesProxy && (
          <h3 className="title">
            <u>https://{subdomain}.fochlac.com</u>
            <span> {wording.isFree}</span>
          </h3>
        )}
        <div className="colRowGrid">
          <div className="row wrap alignStart">
            <div className="col basis300">
              <h4>{wording.address}</h4>
              <InputRow
                defaultValue={name}
                required={false}
                autoComplete="name"
                userInterface={userInterface.name}
                onChange={(name, isValid) => isValid && this.setState({ name })}
                label={[
                  wording.name,
                  <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top" key="info">
                    {wording.nameInfo}
                  </InfoBubble>,
                ]}
              />
              <InputRow
                defaultValue={company}
                autoComplete="company"
                userInterface={userInterface.company}
                required={false}
                onChange={(company, isValid) => isValid && this.setState({ company })}
                label={wording.company}
              />
              <div>
                <AddressBlock onChange={(address, isValid) => this.setState({ address, addressValid: isValid })} value={{}} />
              </div>
            </div>
            <div className="col basis300">
              {!instance.usesProxy && <h4>{wording.instance}</h4>}
              {!instance.usesProxy && (
                <InputRow
                  defaultValue={subdomain}
                  autoComplete="subdomain"
                  userInterface={userInterface.subdomain}
                  onChange={(subdomain, isValid) => isValid && this.setState({ subdomain })}
                  label={wording.title}
                />
              )}
              <h4>{wording.userData}</h4>
              <InputRow
                defaultValue={mail}
                required={false}
                autoComplete="email"
                userInterface={userInterface.mail}
                onChange={(mail, isValid) => isValid && this.setState({ mail })}
                label={[
                  wording.email,
                  <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top" key="info">
                    {wording.mailInfo}
                  </InfoBubble>,
                ]}
              />
              <InputRow
                defaultValue={pass}
                required={false}
                onChange={(pass, isValid) => this.setState({ pass })}
                autoComplete="new-password"
                type="password"
                label={[
                  wording.password,
                  <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top" key="info">
                    {wording.passInfo}
                  </InfoBubble>,
                ]}
                valid={passwordValid}
              />
              <InputRow
                defaultValue={pass}
                required={false}
                onChange={(pass2, isValid) => this.setState({ pass2 })}
                autoComplete="new-password"
                type="password"
                label={[
                  wording.password,
                  <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top" key="info">
                    {wording.passInfo}
                  </InfoBubble>,
                ]}
                valid={passwordValid}
              />
            </div>
          </div>
          <div className="row justifyCenter">
            {instance.usesProxy && (
              <button type="button" onClick={() => this.setState({ view: 'initial' })} className="cancel">
                {wording.cancel}
              </button>
            )}
            <button type="button" onClick={() => this.submit()} disabled={!valid} className="submit">
              {wording.submit}
            </button>
          </div>
        </div>
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
