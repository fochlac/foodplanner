import React from 'react'
import { createContent } from 'UTILS/parseSettings'

export default class Test extends React.Component {
  render() {
    return (
      <div>
        <span>{data.title}</span>
        <span>{data.desctiption}</span>

        <div>{createContent({}, data.settings.content)}</div>
      </div>
    )
  }
}

const data = {
  title: 'Recurring Events',
  description: 'Select a past event and repeat it in an interval',
  settings: {
    content: [
      {
        type: 'flexCol',
        content: [
          {
            type: 'form',
            method: 'post',
            url: '/events/',
            content: [
              {
                type: 'inputRow',
                key: 'creator',
              },
              {
                type: 'inputRow',
                key: 'interval',
              },
              {
                type: 'inputRow',
                key: 'meal',
              },
              {
                type: 'submit',
              },
            ],
          },
        ],
      },
    ],
  },
}
