import { formatDateTime, round } from 'UTILS/date.js'

import DayTimePicker from './DayTimePicker'
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
      addValue: new Date(round(Date.now(), 30 * 60)),
      deadline: new Date(round(props.datefinder && props.datefinder.deadline ? props.datefinder.deadline : Date.now(), 30 * 60)),
      dates: (props.datefinder && props.datefinder.dates) || [],
      description: (props.datefinder && props.datefinder.description) || '',
    }

    this.setAddValue = this.handleDatepicker('addValue').bind(this)
    this.setDeadline = this.handleDatepicker('deadline').bind(this)
    this.addValue = this.addValue.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
  }
  handleDatepicker(field) {
    return function(date) {
      return this.setState({ [field]: date }, this.handleChange)
    }
  }
  handleChange() {
    const { description, deadline, dates } = this.state

    this.props.onChange({
      description: description,
      deadline: deadline.getTime(),
      dates: dates,
      meal_deadline: 3600000,
    })
  }
  handleDescription(evt) {
    this.setState({ description: evt.target.value }, this.handleChange)
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
    const { deadline, dates, addValue, description } = this.state
    const { editable } = this.props

    return (
      <div className="additionalOption datefinderOption">
        <div>
          <label htmlFor="SignUpDialog_datefinder_description">{wording.description}</label>
          <textarea type="text" id="SignUpDialog_datefinder_description" disabled={!editable} />
        </div>
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