import Dialog from 'DIALOG/Dialog.js'
import Payment from 'DIALOG/PriceDialog/Payment.jsx'
import React from 'react'
import dEqual from 'fast-deep-equal'
import { formatDate } from 'UTILS/date.js'

const wording = {
  autopay: 'Zahlungen anfordern',
}

export default class IncomingPaymentsDialog extends React.Component {
  constructor({ userId, close_dialog, signups, meals }) {
    super()

    const myMeals = meals.filter(meal => meal.creatorId === userId).map(meal => meal.id)
    this.state = {
      list: Object.values(signups)
        .filter(signup => !signup.paid && signup.price && myMeals.includes(signup.meal))
        .map(signup => signup.id),
    }

    this.cancel = close_dialog.bind(this)
  }

  componentDidMount() {
    !this.props.historyLoaded && this.props.load_history({ size: 20, busy: true })
  }

  componentDidUpdate(prevProps) {
    const { userId, signups, meals } = this.props
    if (!dEqual(meals, prevProps.meals)) {
      const myMeals = meals.filter(meal => meal.creatorId === userId).map(meal => meal.id)
      const list = Object.values(signups)
        .filter(signup => !signup.paid && signup.price && myMeals.includes(signup.meal))
        .map(signup => signup.id)

      this.setState({ list })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!dEqual(nextProps.meals, this.props.meals) || !dEqual(nextProps.signups, this.props.signups) || !dEqual(this.state.list, nextState.list)) {
      return true
    }
    return false
  }

  render() {
    const { userId, signups, toggle_paid, meals } = this.props

    const mySignups = Object.values(signups)
      .filter(signup => this.state.list.includes(signup.id))
      .reduce((acc, signup) => {
        acc[signup.meal] = acc[signup.meal] ? acc[signup.meal].concat([signup]) : [signup]
        return acc
      }, {})

    return (
      <Dialog className="PriceDialog" closeOnBackdrop={true}>
        <div className="titlebar">
          <h3>Ausstehende Zahlungen:</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body PriceDialog">
          {Object.keys(mySignups).map((mealId, index) => {
            const meal = meals.find(meal => meal.id == mealId)

            return (
              <div key={mealId} className="mealWrapper">
                <h4>
                  {meal.name} - {formatDate(meal.time)}
                </h4>
                <p className="fakeLink push-right pointer" onClick={() => this.props.start_payment([], meal.id)}>
                  {wording.autopay}
                </p>
                <Payment signups={mySignups[mealId]} toggle_paid={toggle_paid.bind(this)} />
              </div>
            )
          })}
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
