import './DateFinder.less'

import { formatDate, formatDateTime, formatTime } from 'UTILS/date.js'

import DayTimePicker from 'UI/DayTimePicker/DayTimePicker'
import React from 'react'

const wording = {
  title: 'Terminfinder',
  signupInfo: 'Bitte melde dich an um abstimmen zu können',
  participants: 'Abstimmungsteilnehmer',
  deadline: 'Abstimmung möglich bis',
  startFinalize: 'Datum auswählen',
  finalize: 'Datum festlegen',
  votes: 'Stimmen',
  cancel: 'Abbrechen',
  addDate1: 'Datum',
  addDate2: 'hinzufügen',
}

const handleWheel = evt => {
  const scrollDiff = evt.currentTarget.scrollWidth - evt.currentTarget.offsetWidth
  if (scrollDiff > 0 && ((evt.deltaY > 0 && evt.currentTarget.scrollLeft < scrollDiff) || (evt.deltaY < 0 && evt.currentTarget.scrollLeft > 0))) {
    evt.preventDefault()
    evt.stopPropagation()

    evt.currentTarget.scrollLeft += evt.deltaY
  }
}

export default class DateFinder extends React.Component {
  constructor(props) {
    super()
    this.state = {
      visibleUsers: -1,
      finalize: false,
      selectedDate: -1,
      addDate: false,
      editDeadline: false,
    }
  }

  toggleDate(evt, options) {
    const classLists = Array.from(evt.target.classList).concat(
      Array.from(evt.target.parentElement.classList),
      Array.from(evt.target.parentElement.parentElement.classList),
    )

    if (!classLists.includes('signupIcon') && this.props.datefinder.deadline > Date.now() && this.props.user.id) {
      this.props.datefinderToggleDate(options)
    }
  }

  showUsers(id) {
    this.setState({ visibleUsers: id })
  }

  selectDate(id) {
    this.setState({ selectedDate: id })
  }

  renderDatesList() {
    const { datefinder, user, edit, datefinderStartDeleteDate, datefinderStartAddDate, datefinderSetDeadline } = this.props
    const { editDeadline } = this.state

    return (
      <div>
        <div className="description">
          <h3>{wording.title}</h3>
          {editDeadline ? (
            <div>
              <label htmlFor="">{wording.deadline}</label>
              <DayTimePicker
                onSubmit={deadline => {
                  datefinderSetDeadline({ datefinder: datefinder.id, deadline })
                  this.setState({ editDeadline: false })
                }}
                time={datefinder.deadline}
                className="deadlineDatefinder"
              />
            </div>
          ) : (
            <p className="marginTop">
              {wording.deadline}:
              <b className="marginLeft">
                {formatDateTime(datefinder.deadline)}
                <span className="fa fa-pencil pointer marginLeft" onClick={() => this.setState({ editDeadline: true })} />
              </b>
            </p>
          )}
          <div className="marginTop">
            <span className="marginRight">{wording.participants}:</span>
            <ul className="participantsList">
              {datefinder.participants.map(participant => (
                <li key={participant.user} className={participant.user === user.id ? 'myself' : ''}>
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="datesList" onWheel={handleWheel}>
          {edit && (
            <li className="addDateWrapper" onClick={() => datefinderStartAddDate(datefinder.id)}>
              <span className="addDate">{wording.addDate1}</span>
              <span className="fa fa-plus fa-2x" />
              <span className="addDate">{wording.addDate2}</span>
            </li>
          )}
          {datefinder.dates.sort((a, b) => a.time - b.time).map(({ id, time, users }, index) => {
            const selected = user && user.id ? users.map(user => user.user).includes(user.id) : false
            const usersVisible = this.state.visibleUsers === index

            return (
              <li key={id} className={selected ? 'selected' : ''}>
                <div onClick={evt => this.toggleDate(evt, { selected, user, date: id })}>
                  <span className="signupIcon" onClick={() => this.showUsers(usersVisible ? -1 : index)}>
                    <span className="fa-users fa" />
                    <span className={(usersVisible ? 'fa-chevron-left' : 'fa-chevron-right') + ' fa marginLeft'} />
                  </span>
                  {edit && <span className="fa fa-times fa-lg deleteIcon signupIcon" onClick={() => datefinderStartDeleteDate(datefinder.id, id)} />}
                  <span className="signupCount">{users.length}</span>
                  <span>
                    <span className="date">{formatDate(time)}</span>
                    <span className="time">{formatTime(time)}</span>
                  </span>
                </div>
                {usersVisible && (
                  <div className="userListWrapper">
                    <h5>{wording.votes}:</h5>
                    <ul className="userList">{users.map(user => <li key={user.user}>{user.name}</li>)}</ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderFinalizeView() {
    const { datefinder, user } = this.props

    return (
      <div>
        <h3>{wording.startFinalize}</h3>
        <ul className="finalizeList">
          {datefinder.dates.sort((a, b) => b.users.length - a.users.length).map(({ id, time, users }) => {
            const selected = this.state.selectedDate === id
            return (
              <li key={id} onClick={evt => this.selectDate(selected ? -1 : id)} className={selected ? 'selected' : ''}>
                <span className={selected ? 'fa fa-check fa-lg check' : 'check'} />
                <span className="wrap">
                  <span className="date marginRight noWrap">{formatDateTime(time)}</span>
                  <span className="marginRight noWrap">
                    {wording.votes} ({users.length}):
                  </span>
                  <ul className="participantsList">{users.map(user => <li key={user.user}>{user.name}</li>)}</ul>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  render() {
    const { datefinder, user, datefinderFinalize } = this.props
    if (!datefinder) {
      return null
    }

    return (
      <div className="datefinder">
        {this.state.finalize ? this.renderFinalizeView() : this.renderDatesList()}
        <div>
          {datefinder.creator === user.id &&
            (this.state.finalize ? (
              <div>
                <button className="finalize marginRight" onClick={() => this.setState({ finalize: false })}>
                  {wording.cancel}
                </button>
                <button
                  className="finalize"
                  disabled={this.state.selectedDate === -1}
                  onClick={() => datefinderFinalize(datefinder.id, this.state.selectedDate)}
                >
                  {wording.finalize}
                </button>
              </div>
            ) : (
              <div>
                <button className="finalize" onClick={() => this.setState({ finalize: true, visibleUsers: -1 })}>
                  {wording.startFinalize}
                </button>
              </div>
            ))}
        </div>
      </div>
    )
  }
}
