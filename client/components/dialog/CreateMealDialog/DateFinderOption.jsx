import { formatDateTime, round } from 'UTILS/date.js'

import DayTimePicker from 'RAW/DayTimePicker'
import React from 'react'

const wording = {
  deadline: 'Teilnahmeschluss',
  description: 'Beschreibung',
  times: 'Termine',
  dates: 'Mögliche Termine',
  add: 'Hinzufügen',
}

export default class DateFinderOption extends React.Component {
  constructor(props) {
    super()

    this.state = {
      addValue: round(Date.now(), 30 * 60),
      deadline: round(props.datefinder && props.datefinder.deadline ? props.datefinder.deadline : Date.now(), 30 * 60),
      dates: (props.datefinder && props.datefinder.dates) || [],
      description: (props.datefinder && props.datefinder.description) || '',
    }

    this.setAddValue = this.handleDatepicker('addValue').bind(this)
    this.setDeadline = this.handleDatepicker('deadline').bind(this)
    this.addValue = this.addValue.bind(this)
  }
  handleDatepicker(field) {
    return function(date) {
      return this.setState({ [field]: round(date, 30 * 60) }, this.handleChange)
    }
  }
  handleChange() {
    const { description, deadline, dates } = this.state

    this.props.onChange({
      deadline: deadline.getTime(),
      dates: dates,
      meal_deadline: 3600000,
    })
  }

  addValue() {
    var time = this.state.addValue.getTime()

    if (this.state.dates.map(date => date.time).includes(time)) {
      return
    }

    this.setState(
      {
        dates: this.state.dates.concat([{ time: time }]),
      },
      this.handleChange,
    )
  }

  deleteValue(index) {
    this.setState(
      {
        dates: this.state.dates.filter((item, ind) => index !== ind),
      },
      this.handleChange,
    )
  }

  render() {
    const { deadline, dates, addValue } = this.state
    const { editable } = this.props

    return (
      <div className="additionalOption datefinderOption">
        <div>
          <label htmlFor="SignUpDialog_deadline">{wording.deadline}</label>
          <DayTimePicker className="deadline" onChange={this.setDeadline} time={deadline} disabled={!editable} />
        </div>
        <div>
          <label>{wording.dates}</label>
          <ul className="valueCloud">
            {dates.map((val, ind) => (
              <li key={ind}>
                {formatDateTime(val.time)}
                {editable ? <span className="fa fa-times pointer" onClick={() => this.deleteValue(ind)} /> : null}
              </li>
            ))}
          </ul>
          {editable ? (
            <div>
              <div className="row wrap">
                <DayTimePicker className="addValue" onChange={this.setAddValue} time={addValue} />
                <button className="addButton" onClick={this.addValue}>
                  {wording.add}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
