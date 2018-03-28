import './PrintDialog.less'

import Dialog from 'DIALOG/Dialog.js'
import React from 'react'
import { formatDate } from 'UTILS/date.js'

export default class PrintDialog extends React.Component {
  constructor(props) {
    super()

    this.state = {
      selected: props.meals.filter(meal => meal.print).map(meal => meal.id),
      print: false,
    }

    this.close = props.close_dialog.bind(this)
    this.renderMeal = this.renderMeal.bind(this)
  }

  print() {
    this.props.meal_set_print(this.state.selected)
    this.setState({ print: true }, this.close)
  }

  componentWillUnmount() {
    if (this.state.print) {
      window.print()
    }
  }

  setCheckbox(mealId, state) {
    this.setState({
      selected: state ? [...this.state.selected, mealId] : this.state.selected.filter(id => id !== mealId),
    })
  }

  renderMeal(meal) {
    return (
      <tr key={meal.id}>
        <td>{formatDate(meal.time)}</td>
        <td>{meal.name}</td>
        <td>
          <input
            type="checkbox"
            checked={this.state.selected.includes(meal.id)}
            onChange={this.setCheckbox.bind(this, meal.id, !this.state.selected.includes(meal.id))}
          />
        </td>
      </tr>
    )
  }

  render() {
    const startOfDay = new Date().setHours(0, 0, 0)

    return (
      <Dialog className="PrintDialog" closeOnBackdrop={true}>
        <div className="titlebar">
          <h3>Termine drucken</h3>
          <span className="fa fa-times push-right pointer" onClick={this.close} />
        </div>
        <div className="body">
          <h4>Termine auswählen</h4>
          <table>
            <thead>
              <tr>
                <th>Termin</th>
                <th>Name</th>
                <th>Drucken</th>
              </tr>
            </thead>
            <tbody>
              {this.props.meals
                .filter(meal => meal.time > startOfDay)
                .sort((a, b) => a.time - b.time)
                .map(this.renderMeal)}
            </tbody>
          </table>
        </div>
        <div className="foot">
          <button type="button" className="cancel" onClick={this.close}>
            Schließen
          </button>
          <button type="button" className="submit" onClick={this.print.bind(this)}>
            Drucken
          </button>
        </div>
      </Dialog>
    )
  }
}
