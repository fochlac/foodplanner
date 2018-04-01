import DayTimePicker from 'RAW/DayTimePicker'
import Dialog from 'DIALOG/Dialog.js'
import React from 'react'
import { formatDate } from 'UTILS/date.js'

const wording = {
  addDate: 'Datum hinzufügen',
  date: 'Datum',
  cancel: 'Abbrechen',
  submit: 'Abschicken',
}

export default class AddDateDialog extends React.Component {
  constructor(props) {
    super()
    this.state = {
      time: new Date(),
    }

    this.dateInput = this.handleInput('time').bind(this)
  }

  submit() {
    const { time } = this.state
    const { datefinder, datefinderAddDate } = this.props
    if (!datefinder) {
      return
    }

    datefinderAddDate({
      datefinder,
      time: time.getTime(),
    })
  }

  handleInput(field) {
    return date => {
      this.setState({
        [field]: date,
      })
    }
  }

  render() {
    const { close_dialog } = this.props
    const { time } = this.state

    return (
      <Dialog closeOnBackdrop={true} className="AddDateDialog">
        <div className="titlebar">
          <h3>{wording.addDate}</h3>
          <span className="fa fa-times push-right pointer" onClick={close_dialog} />
        </div>
        <div className="body">
          <label htmlFor="AddDateDialog_date">{wording.date}</label>
          <DayTimePicker time={time} onChange={this.dateInput} />
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={close_dialog}>
            {wording.cancel}
          </button>
          <button type="button" className="red submit" onClick={this.submit.bind(this)}>
            {wording.submit}
          </button>
        </div>
      </Dialog>
    )
  }
}
