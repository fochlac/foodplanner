import './UserSearch.less'

import React from 'react'

const wording = {
  user: 'Benutzer',
}

export default class UserSearch extends React.Component {
  constructor(props) {
    super()

    this.state = {
      searchString: '',
      id: props.id ? props.id : 'email_input_' + Date.now(),
    }

    this.startSearch = this.startSearch.bind(this)
    this.selectUser = this.selectUser.bind(this)
  }

  startSearch({ target }) {
    const value = target.value
    this.setState(
      {
        searchString: value,
      },
      () => {
        if (value.length && !this.timeout) {
          this.timeout = value

          // check searchString and block for 300ms
          this.showTimeout = setTimeout(() => {
            // check if searchString changed during timeout; if so, recheck
            if (this.state.searchString !== this.timeout) {
              // clear blocker
              this.timeout = false
              this.startSearch({ target: { value: this.state.searchString } })
            } else {
              // clear blocker
              this.timeout = false
            }
          }, 300)

          this.props.searchUser(value)
        }
      },
    )
  }

  selectUser(user) {
    const { onChange } = this.props
    const { searchString } = this.state
    this.setState({ user, searchString: user.name, focused: false })
    onChange && onChange(user.id)
  }

  render() {
    const { user, searchString, focused } = this.state
    const { hiddenBusy, busyList, userSuggestions } = this.props.app

    return (
      <div className="mailFrame">
        <div className="row">
          <input
            type="text"
            id={this.state.id}
            value={searchString}
            onChange={this.startSearch}
            onFocus={() => {
              clearTimeout(this.focus_timeout)
              this.setState({ focused: true })
            }}
            onBlur={() => (this.focus_timeout = setTimeout(() => this.setState({ focused: false }), 300))}
            autoComplete="off"
            placeholder={wording.user}
          />
          <span className={'fa fa-lg fa-fw fa-spin fa-spinner' + (hiddenBusy && busyList.includes('searchUser') ? '' : ' invisible')} />
        </div>
        {focused && userSuggestions && userSuggestions.length ? (
          <ul className="dropdown">
            {userSuggestions.slice(0, 10).map(user => (
              <li key={user.id} onClick={() => this.selectUser(user)}>
                <span className="fa fa-caret-right marginRight" />
                {user.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
}
