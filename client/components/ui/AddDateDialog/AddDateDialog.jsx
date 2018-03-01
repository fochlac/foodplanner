import DayTimePicker from 'UI/DayTimePicker/DayTimePicker'
import Dialog from 'UI/Dialog.js'
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
      date: new Date(),
    }

    this.dateInput = this.handleInput('date').bind(this)
  }

  submit() {
    const { date } = this.state
    const { datefinder, datefinderAddDate } = this.props
    if (!date || !datefinder) {
      return
    }

    datefinderAddDate({
      datefinder,
      date,
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
    const { date } = this.state

    return (
      <Dialog closeOnBackdrop={true} className="AddDateDialog">
        <div className="titlebar">
          <h3>{wording.addDate}</h3>
          <span className="fa fa-times push-right pointer" onClick={close_dialog} />
        </div>
        <div className="body">
          <label htmlFor="AddDateDialog_date">{wording.date}</label>
          <DayTimePicker time={date} onChange={this.dateInput} />
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
