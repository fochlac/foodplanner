import React from 'react'
import Test from 'RAW/test.jsx'

const wording = {
  name: 'Name',
  email: 'E-Mail',
  rank: 'Rang',
  balance: 'Kontostand',
  admin: 'Administrator',
  user: 'Nutzer',
  inactive: 'Aktiv',
}

export default class PluginAdministration extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    return (
      <div>
        <Test />
      </div>
    )
  }
}
