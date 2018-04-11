import Pager from 'RAW/Pager.jsx'
import React from 'react'

const wording = {
  name: 'Name',
  email: 'E-Mail',
  rank: 'Rang',
  balance: 'Kontostand',
  admin: 'Administrator',
  user: 'Nutzer',
  inactive: 'Aktiv',
}

export default class UserAdministration extends React.Component {
  constructor(props) {
    super()
  }
  renderWrapper(children) {
    return (
      <table className="textAlignCenter userList">
        <thead>
          <tr>
            <th>{wording.name}</th>
            <th>{wording.email}</th>
            <th>{wording.balance}</th>
            <th>{wording.rank}</th>
            <th>{wording.inactive}</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    )
  }

  render() {
    const { users, setAdmin, activateUser, deactivateUser, self } = this.props

    return (
      <div>
        {users && (
          <Pager wrapper={this.renderWrapper} size={30} bottom={true}>
            {users.sort((a, b) => a.name.localeCompare(b.name)).map(user => (
              <tr key={user.id} className={self == user.id ? 'self' : undefined}>
                <td>{user.name}</td>
                <td>{user.mail}</td>
                <td>{user.balance}</td>
                <td>
                  {user.admin ? (
                    <span key="word_admin" className="col_red">
                      {wording.admin}
                    </span>
                  ) : null}
                  {user.admin && self != user.id ? (
                    <span
                      key="down"
                      className="fa fa-level-down pointer marginLeft"
                      onClick={() =>
                        setAdmin({
                          user: user.id,
                          admin: false,
                        })
                      }
                    />
                  ) : null}
                  {!user.admin && <span key="word_user">{wording.user}</span>}
                  {!user.admin && <span key="up" className="fa fa-level-up pointer marginLeft" onClick={() => setAdmin({ user: user.id, admin: true })} />}
                </td>
                <td className="pointer" data-type={wording.delete}>
                  {self != user.id &&
                    (user.inactive ? (
                      <span className="fa fa-times marginLeft" onClick={() => activateUser({ user: user.id })} />
                    ) : (
                      <span className="fa fa-check marginLeft" onClick={() => deactivateUser({ user: user.id })} />
                    ))}
                </td>
              </tr>
            ))}
          </Pager>
        )}
      </div>
    )
  }
}
