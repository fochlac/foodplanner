import './DateFinder.less'

import { formatDate, formatTime } from 'UTILS/date.js'
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'

const wording = {
  title: 'Terminfinder',
  signupInfo: 'Bitte melde dich an um abstimmen zu können',
  participants: 'Teilnehmer'
}

export default class DateFinder extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    const { datefinder, user, datefinderToggleDate } = this.props
    if (!datefinder) {
      return null
    }

    return (
      <div>
        <div className="description">
          <h3>{wording.title}</h3>
          <p>{datefinder.description}</p>
          <p>{wording.participants}:
            <ul className="userList">
              {datefinder.participants.map(participant => <li key={participant.id} className={participant.id === user.id ? 'myself' : ''}>{participant.name}</li>)}
            </ul>
          </p>
        </div>
        <ul className="datesList">
          {datefinder.dates.map(({ id, time, users }) => {
            const selected = user && user.id ? users.map(user => user.user).includes(user.id) : false,
              editable = datefinder.deadline < Date.now() || !user.id;

            return (
              <li key={id} className={selected ? 'selected' : ''} onClick={editable ? datefinderToggleDate({ selected, user: user.id, date: id }) : undefined}>
                {editable && <span className={(selected ? 'fa-check' : 'fa-times') + ' fa fa-lg signupIcon'} />}
                <span className="signupCount">{users.length}</span>
                <span>
                  <span className="date">{formatDate(time)}</span>
                  <span className="time">{formatTime(time)}</span>
                </span>
                <ul className="userList">{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
