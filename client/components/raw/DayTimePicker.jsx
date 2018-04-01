import { formatDate, formatTime, round } from 'UTILS/date.js'
import './DayTimePicker.less'
import 'pikaday/css/pikaday.css'

import DatePicker from '@reaktor/react-pikaday-component'
import React from 'react'

const wording = {
  german: {
    previousMonth: 'Letzter Monat',
    nextMonth: 'Nächster Monat',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'October', 'November', 'Dezember'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  },
  submit: 'Speichern',
}

const pikaOptions = {
  enableSelectionDaysInNextAndPreviousMonths: true,
  firstDay: 1,
  i18n: wording.german,
}

const times = Array(48)
  .fill(0)
  .map((item, index) => ('00' + Math.floor(index / 2) + ':' + (index % 2 ? '30' : '00')).slice(-5))

export default class DayTimePicker extends React.Component {
  constructor(props) {
    super()

    this.state = {
      time: props.time ? new Date(props.time) : new Date(),
    }

    this.handleDatepicker = this.handleDatepicker.bind(this)
    this.handleTime = this.handleTime.bind(this)
  }

  componentDidUpdate(oldProps) {
    if (this.props.time !== oldProps.time) {
      this.setState({ time: this.props.time ? new Date(this.props.time) : new Date() })
    }
  }

  handleDatepicker(jsDate) {
    const { onChange } = this.props
    const { time } = this.state

    jsDate.setHours(time.getHours())
    jsDate.setMinutes(time.getMinutes())

    onChange && onChange(jsDate)
    this.setState({ time: jsDate })
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
          <DatePicker value={new Date(time)} format="DD.MM.YY" onChange={this.handleDatepicker} {...pikaOptions} />
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
