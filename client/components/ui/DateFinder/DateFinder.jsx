import { formatDate, formatTime } from 'UTILS/date.js'

import React from 'react'

export default class DefaultPage extends React.Component {
  constructor(props) {
    super()

    this.refreshContent = this.refreshContent.bind(this)
  }
  render() {
    const { datefinder, user } = this.props
    if (!datefinder) {
      return null
    }

    return (
      <div>
        <ul>
          {datefinder.dates.map(({ id, time, users }) => (
            <li key={id}>
              <span>
                <span className="date">{formatDate(time)}</span>
                <span className="time">{formatTime(time)}</span>
              </span>
              <input type="checkbox" checked={true} onClick={() => null} />
              <span className="signupCount">{users.length}</span>
              <span className="userList">{users.map(user => user.name).join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

/*
  data structure
  datefinder: {
    1: {
      id: 1,
      creator: 2,
      meal: 5,
      description: "lorem ipsum lauret amour",
      deadline: 12312123123,
      uservotes: [1, 4, 5, 9],
      dates[
        {
          id: 23,
          time: 123123000,
          users: [1, 4, 5, 9]
        },
        {
          id: 24,
          time: 123123123,
          users: [1, 5, 9]
        },
        {
          id: 25,
          time: 123123456,
          users: [5, 9]
        }
      ]
    }
  }
 */
