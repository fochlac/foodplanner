import './DateFinder.less'

import { formatDate, formatTime, formatDateTime } from 'UTILS/date.js'
import React from 'react'

const wording = {
  title: 'Terminfinder',
  signupInfo: 'Bitte melde dich an um abstimmen zu können',
  participants: 'Abgestimmt',
  deadline: 'Abstimmung möglich bis',
  startFinalize: 'Datum auswählen',
  finalize: 'Datum festlegen',
  votes: 'Stimmen'
}

const handleWheel = evt => {
  const scrollDiff = evt.currentTarget.scrollWidth - evt.currentTarget.offsetWidth;
  if (scrollDiff > 0 && ((evt.deltaY > 0 && evt.currentTarget.scrollLeft < scrollDiff) || (evt.deltaY < 0 && evt.currentTarget.scrollLeft > 0))) {
    evt.preventDefault();
    evt.stopPropagation();

    evt.currentTarget.scrollLeft += evt.deltaY
  }
}

export default class DateFinder extends React.Component {
  constructor(props) {
    super()
    this.state = {
      visibleUsers: -1,
      finalize: false,
      selectedDate: -1
    }
  }

  toggleDate(evt, options) {
    const classLists = Array.from(evt.target.classList).concat(Array.from(evt.target.parentElement.classList), Array.from(evt.target.parentElement.parentElement.classList));

    if (!classLists.includes('signupIcon') && (this.props.datefinder.deadline < Date.now() || !this.props.user.id)) {
      this.props.datefinderToggleDate(options)
    }
  }

  showUsers(id) {
    this.setState({ visibleUsers: id });
  }

  selectDate(id) {
    this.setState({ visibleUsers: id });
  }

  renderDatesList() {
    const { datefinder, user } = this.props

    return (< ul className="datesList" onWheel={handleWheel} >
      {
        datefinder.dates.sort((a, b) => (a.time - b.time)).map(({ id, time, users }, index) => {
          const selected = user && user.id ? users.map(user => user.user).includes(user.id) : false;
          const usersVisible = this.state.visibleUsers === index

          return (
            <li key={id} className={selected ? 'selected' : ''}>
              <div onClick={evt => this.toggleDate(evt, { selected, user, date: id })}>
                <span className="signupIcon" onClick={() => this.showUsers(usersVisible ? -1 : index)}>
                  <span className="fa-users fa" ></span>
                  <span className={(usersVisible ? "fa-chevron-left" : "fa-chevron-right") + " fa marginLeft"} ></span>
                </span>
                <span className="signupCount">{users.length}</span>
                <span>
                  <span className="date">{formatDate(time)}</span>
                  <span className="time">{formatTime(time)}</span>
                </span>
              </div>
              {usersVisible && <div className="userListWrapper">
                <h5>{wording.votes}:</h5>
                <ul className="userList">{users.map(user => <li key={user.user}>{user.name}</li>)}</ul>
              </div>}
            </li>
          )
        })
      }
    </ul >)
  }

  renderFinalizeView() {
    const { datefinder, user } = this.props

    return (< ul className="finalizeList" >
      {
        datefinder.dates.sort((a, b) => (a.users.length - b.users.length)).map(({ id, time, users }) => (
          <li key={id} onClick={evt => this.selectDate(id)}>
            <div>
              <span className={this.state.selectedDate === id ? 'fa fa-check fa-lg' : null}></span>
              <span className="signupCount">{users.length}</span>
              <span>
                <span className="date">{formatDate(time)}</span>
                <span className="time">{formatTime(time)}</span>
              </span>
            </div>
            <div>
              <span className="marginRight">{wording.participants}:</span>
              <ul className="participantsList">{users.map(user => <li key={user.user}>{user.name}</li>)}</ul>
            </div>
          </li>
        ))
      }
    </ul >)
  }

  render() {
    const { datefinder, user, datefinderFinalize } = this.props
    if (!datefinder) {
      return null
    }

    return (
      <div>
        <div className="description">
          <h3>{wording.title}</h3>
          <p className="marginTop">{wording.deadline}: {formatDateTime(datefinder.deadline)}</p>
          <p className="marginTop">{datefinder.description}</p>
          <div className="marginTop">
            <span className="marginRight">{wording.participants}:</span>
            <ul className="participantsList">
              {datefinder.participants.map(participant => <li key={participant.user} className={participant.user === user.id ? 'myself' : ''}>{participant.name}</li>)}
            </ul>
          </div>
        </div>
        {this.state.finalize ? this.renderFinalizeView() : this.renderDatesList()}
        {(datefinder.creator === user.id) && (this.state.finalize
          ? <button className="finalize" onClick={() => datefinderFinalize(this.state.selectedDate)}>{wording.finalize}</button>
          : <button className="finalize" onClick={this.setState.bind(this, { finalize: true, visibleUsers: -1 })}>{wording.startFinalize}</button>)}
      </div>
    )
  }
}
