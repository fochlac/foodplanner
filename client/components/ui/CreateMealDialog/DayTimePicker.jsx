import 'react-day-picker/lib/style.css'

import { formatDate, formatTime, round } from 'UTILS/date.js'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import React from 'react'

const times = Array(48)
  .fill(0)
  .map((item, index) => ('00' + Math.floor(index / 2) + ':' + (index % 2 ? '30' : '00')).slice(-5))

export default class DayTimePicker extends React.Component {
  constructor(props) {
    super()

    this.handleDatepicker = this.handleDatepicker.bind(this)
    this.handleTime = this.handleTime.bind(this)
  }

  handleDatepicker(date) {
    var jsDate = date.toDate(),
      obj = void 0

    jsDate.setHours(this.props.time.getHours())
    jsDate.setMinutes(this.props.time.getMinutes())

    this.props.onChange(jsDate)
  }

  handleTime(evt) {
    var newDate = new Date(this.props.time),
      values = evt.target.value.split(':')
    newDate.setHours(values[0])
    newDate.setMinutes(values[1])

    this.props.onChange(newDate)
  }

  render() {
    const { className, time } = this.props

    return (
      <div className={(className ? className : '') + ' row'}>
        <DayPickerInput value={formatDate(time)} format="DD.MM.YY" onDayChange={this.handleDatepicker} />
        <select className="timePicker" onChange={this.handleTime} value={formatTime(round(time, 30 * 60))}>
          {times.map(time => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
