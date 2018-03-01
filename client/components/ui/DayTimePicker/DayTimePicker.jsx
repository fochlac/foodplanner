import 'react-day-picker/lib/style.css'
import './DayTimePicker.less'

import { formatDate, formatTime, round } from 'UTILS/date.js'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import React from 'react'

const times = Array(48)
  .fill(0)
  .map((item, index) => ('00' + Math.floor(index / 2) + ':' + (index % 2 ? '30' : '00')).slice(-5))

const wording = {
  submit: 'Speichern',
}

export default class DayTimePicker extends React.Component {
  constructor(props) {
    super()

    this.state = {
      time: props.time ? props.time : new Date(),
    }

    this.handleDatepicker = this.handleDatepicker.bind(this)
    this.handleTime = this.handleTime.bind(this)
  }

  handleDatepicker(date) {
    const { onChange } = this.props
    const { time } = this.state
    var jsDate = date.toDate(),
      timeObj = new Date(time)

    jsDate.setHours(timeObj.getHours())
    jsDate.setMinutes(timeObj.getMinutes())

    onChange && onChange(jsDate)
    this.setState({ time: new Date(jsDate) })
  }

  handleTime(evt) {
    const { onChange } = this.props
    let newDate = new Date(this.state.time),
      values = evt.target.value.split(':')
    newDate.setHours(values[0])
    newDate.setMinutes(values[1])

    onChange && onChange(newDate)
    this.setState({ time: newDate })
  }

  render() {
    const { className, disabled, onSubmit } = this.props
    const { time } = this.state

    return (
      <div className={(className ? className : '') + ' DayPicker'}>
        {!disabled ? (
          <DayPickerInput value={formatDate(time)} format="DD.MM.YY" onDayChange={this.handleDatepicker} />
        ) : (
          <input type="text" disabled={true} value={formatDate(time)} className="DayPickerInput" />
        )}
        <select className="timePicker" onChange={this.handleTime} value={formatTime(round(time, 30 * 60))} disabled={disabled}>
          {times.map(time => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
        {onSubmit ? <button onClick={() => onSubmit(this.state.time)}>{wording.submit}</button> : null}
      </div>
    )
  }
}
