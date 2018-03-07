import './Dashboard.less'

import Meal from 'UI/Meal.js'
import Pager from 'UI/Pager/Pager.jsx'
import React from 'react'
import UserFrame from 'UI/UserFrame.js'

const wording = {
  offlineWarn: 'Aufgrund fehlender Internetverbindung verwendet diese Seite aktuell gecachte (alte) Daten.',
  loadMessage: 'Termindaten werden geladen.'
}

export default class Dashboard extends React.Component {
  constructor(props) {
    super()

    this.state = {
      filter: 'meals',
    }

    this.refreshContent = this.refreshContent.bind(this)
  }

  refreshContent() {
    if (this.state.filter === 'meals') {
      this.props.refresh(this.props.app.dataversion)
    }
  }

  componentDidMount() {
    window.addEventListener('focus', this.refreshContent)
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.refreshContent)
  }

  setFilter(filter) {
    this.setState({ filter: filter })
    if (filter === 'oldMeals') {
      this.loadHistory(1);
    }
  }

  loadHistory(page) {
    this.props.load_history({page})
  }

  render() {
    const startOfDay = new Date().setHours(0, 0, 0)
    const filters = [
      {
        name: 'Aktuelle Termine',
        type: 'meals',
      },
      {
        name: 'Vergangene Termine',
        type: 'oldMeals',
      },
    ]
    let mealList

    if (this.state.filter === 'meals') {
      mealList = this.props.meals.filter(meal => meal.time > startOfDay)
    } else {
      mealList = this.props.oldMealIds.map(id => this.props.meals.find(meal => meal.id === id))
    }

    return (
      <div className="dashboard">
        {this.props.app.offline ? (
          <div className="offlineBar">
            <div className="warning">{wording.offlineWarn}</div>
          </div>
        ) : null}
        {this.props.login && <UserFrame />}
        <div className="filters">
          <ul className="filterList">
            {filters.map(filter => (
              <li
                key={filter.type}
                className={'filter' + (this.state.filter.includes(filter.type) ? ' selected' : '')}
                onClick={() => this.setFilter(filter.type)}
              >
                {filter.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="meals">
          <Pager size={5} top={true} bottom={true} inactive={this.state.filter === 'meals'} onChange={({page}) => this.loadHistory(page)}>
            {mealList.map(
              (meal, index) =>
                meal ? (
                  <Meal id={meal.id} key={meal.id} showPrint={this.state.filter === 'meals'} />
                ) : (
                  <div className="emptyMeal meal" key={'invalidMeal_' + index}>
                    <div className="titlebar">
                      <h4 className="title">&#9644;&#9644;&#9644;&#9644;</h4>
                    </div>
                    <div className="details">
                      <span className="fa fa-spin fa-spinner fa-fw" />
                      <span>{wording.loadMessage}</span>
                    </div>
                  </div>
                ),
            )}
          </Pager>
        </div>
      </div>
    )
  }
}
