import Dialog from 'UI/Dialog.js'
import Payment from 'UI/PriceDialog/Payment.jsx'
import React from 'react'
import dEqual from 'fast-deep-equal'

export default class IncomingPaymentsDialog extends React.Component {
  constructor({ userId, meals, signups, close_dialog }) {
    super()
    const myMeals = meals.filter(meal => meal.creatorId === userId).map(meal => meal.id)

    this.state = {
      list: Object.values(signups)
        .filter(signup => !signup.paid && myMeals.includes(signup.meal))
        .map(signup => signup.id),
    }

    this.cancel = close_dialog.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!dEqual(nextProps.meal, this.props.meal) || !dEqual(nextProps.signups, this.props.signups)) {
      return true
    }
    return false
  }

  render() {
    const { signups, toggle_paid } = this.props
    const { list } = this.state

    const mySignups = Object.values(signups).filter(signup => list.includes(signup.id))

    return (
      <Dialog className="PriceDialog" closeOnBackdrop={true}>
        <div className="titlebar">
          <h3>Ausstehende Zahlungen:</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body PriceDialog">
          <Payment signups={mySignups} toggle_paid={toggle_paid.bind(this)} />
        </div>
        <div className="foot">
          <span>
            <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
              Schließen
            </button>
          </span>
        </div>
      </Dialog>
    )
  }
}
