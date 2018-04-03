import './SignUp.less'

import Dialog from 'DIALOG/Dialog.js'
import React from 'react'
import SignUpOption from './SignUpOption.jsx'

export default class SignUpDialog extends React.Component {
  constructor(props) {
    super()

    this.state = props.edit
      ? props.signup
      : {
          name: props.user && props.user.name ? props.user.name : '',
          userId: props.user && props.user.id ? props.user.id : 0,
          signedUp: props.signedUp,
          options: props.meal
            ? props.meal.options.map(option => ({
                id: option.id,
                value: option.values[0] ? option.values[0].name : null,
                show: undefined,
              }))
            : [],
          comment: '',
        }

    this.nameInput = this.handleInput('name').bind(this)
    this.commentInput = this.handleInput('comment').bind(this)

    this.mySetState = function(data, cb) {
      this.setState(data, () => {
        const app = history && history.state && history.state.app ? history.state.app : {}
        history.replaceState({ app: { ...app, dialog: { ...(app.dialog ? app.dialog : {}), state: this.state } } }, document.title, document.location.href)
      })
    }
  }

  handleInput(field) {
    return evt => {
      this.mySetState({
        [field]: evt.target.value,
      })
    }
  }

  submit() {
    const edit = this.props.edit

    this.props[edit ? 'meal_edit' : 'meal_signup']({
      name: this.state.name,
      userId: this.state.name === this.props.user.name ? this.state.userId : undefined,
      comment: this.state.comment,
      meal: this.props.meal.id,
      options: this.state.options,
      signup: edit ? this.props.signup.id : null,
    })
  }

  cancel() {
    this.props.close_dialog()
  }

  setOption(id) {
    return newOption => {
      let newArr = this.state.options.concat([]),
        pos = newArr.findIndex(opt => opt.id === id)

      newArr[pos] = newOption

      this.mySetState({
        options: newArr,
      })
    }
  }

  render() {
    const p = this.props,
      s = this.state

    let calculatedPrice = 0

    if (this.props.invalid) {
      return (
        <Dialog className="SignUpDialog">
          <div className="titlebar">
            <h3>Ungültige Anmeldung!</h3>
            <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
          </div>
          <div className="body">
            <p>Diese Anmeldung ist leider nicht verfügbar.</p>
          </div>
          <div className="foot">
            <button type="button" className="cancel" onClick={this.cancel.bind(this)}>
              Schließen
            </button>
          </div>
        </Dialog>
      )
    }

    calculatedPrice += +p.meal.price
    s.options.forEach(option => {
      let opt = p.meal.options.find(opt => opt.id === option.id)
      switch (opt.type) {
        case 'select':
          calculatedPrice += +opt.values.find(val => val.name === option.value).price
          break
        case 'count':
          calculatedPrice += +opt.values.find(val => val.name === option.value).price * option.count
          break
        case 'toggle':
          calculatedPrice += option.show ? +opt.price : 0
          break
      }
    })

    return (
      <Dialog className="SignUpDialog">
        <div className="titlebar">
          <h3>Anmeldung für: {p.meal.name}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body">
          {!s.userId ? (
            <div
              className="warning row title anon"
              title="Als anonymer Nutzer kann nur der Organisator dieses Termins deine Anmeldung verändern. Bitte logge dich mit deiner E-Mail ein um deine Anmeldungen verwalten zu können."
            >
              <span>
                <p>Du meldest dich als anonymer Nutzer an.</p>
                {!(p.user && p.user.id) && (
                  <p className="fakeLink pointer" onClick={p.start_sign_in}>
                    Jetzt einloggen oder Accout anlegen!
                  </p>
                )}
              </span>
            </div>
          ) : null}
          {s.signedUp && s.userId ? (
            <div className="warning row signedUp">
              <p>Du bist für dieses Angebot bereits angemeldet!</p>
            </div>
          ) : null}
          {(p.user.name && s.name === p.user.name) || p.edit ? (
            <div>
              <label htmlFor="SignUpDialog_name">Name</label>
              <div className="row">
                <span className="signupName">{s.name}</span>
                {!p.edit ? (
                  <span className="fakeLink push-right editName edit" onClick={this.setState.bind(this, { name: undefined, userId: undefined }, null)}>
                    <span className="fa fa-pencil" />Anonymen Nutzer anmelden
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                <label htmlFor="SignUpDialog_name" className="inlineBlock">
                  Name
                </label>
                {!p.edit && p.user.name && !s.userId ? (
                  <span
                    className="fakeLink push-right editName cancel inlineBlock"
                    onClick={this.setState.bind(this, { name: p.user.name, userId: p.user.id }, null)}
                  >
                    <span className="fa fa-times" /> Abbrechen
                  </span>
                ) : null}
              </div>
              <input type="text" id="SignUpDialog_name" defaultValue={s.name} onChange={this.nameInput} />
            </div>
          )}
          {p.meal.options.map((option, index) => {
            const valueObj = this.state.options.find(opt => opt.id === option.id)
            return <SignUpOption option={option} key={index} value={valueObj ? valueObj : {}} setOption={this.setOption(option.id)} />
          })}
          <div className="estimated_price" title="Der Preis wurde noch nicht finalisiert und kann sich jederzeig ändern.">
            <span className="push-right">Vorläufiger Preis: {calculatedPrice ? calculatedPrice.toFixed(2) : 'unbekannt'} €</span>
          </div>
          <div>
            <label htmlFor="SignUpDialog_comment">Kommentar</label>
            <textarea type="text" id="SignUpDialog_comment" defaultValue={p.edit ? p.signup.comment : null} onChange={this.commentInput} />
          </div>
        </div>
        <div className="foot">
          <button type="button" className="cancel" onClick={this.cancel.bind(this)}>
            Abbrechen
          </button>
          <button type="button" className="submit" onClick={this.submit.bind(this)}>
            {p.edit ? 'Speichern' : 'Anmelden'}
          </button>
        </div>
      </Dialog>
    )
  }
}
