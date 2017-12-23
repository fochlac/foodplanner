import React from 'react';
import Meal from 'UI/Meal.js';
import UserFrame from 'UI/UserFrame.js';
import './Dashboard.less';


export default class Dashboard extends React.Component {
    constructor(props) {
        super();

        this.state = {
            filter: ['meals']
        }
    }

    setFilter(filter) {
        this.setState({filter: [filter]});
    }

    render() {
        const mealLists = this.state.filter.map(filter => this.props[filter]),
            filters = [{
                name: 'Aktuelle Termine',
                type: 'meals'
            },{
                name: 'Vergangene Termine',
                type: 'oldMeals'
            }];

        return (
            <div className="dashboard">
                {
                    this.props.app.offline
                    ? <div className="offlineBar">
                        <div className="warning">
                            <span className="fa fa-exclamation-triangle fa-lg"></span>
                            Aufgrund fehlender Internetverbindung verwendet diese Seite aktuell gecachte Daten.
                            Aktionen, die deswegen nicht gesendet werden können, werden übertragen, sobald wieder eine Internetverbindung besteht.
                        </div>
                    </div>
                    : null
                }
                <UserFrame />
                <div className="filters">
                    <ul className="filterList">
                        {
                            filters.map(filter =>
                            <li key={filter.type} className={'filter' + (this.state.filter.includes(filter.type) ? ' selected' : '')} onClick={() => this.setFilter(filter.type)}>
                                {filter.name}
                            </li>
                            )
                        }
                    </ul>
                </div>
                {
                    mealLists.map((mealList, index) =>
                        <div key={index}>
                            {
                                (mealLists.length > 1 && mealList.length > 0)
                                ? <h3 className="mealListHeader">{filters[index].name}</h3>
                                : null
                            }
                            {
                                mealList.map((meal) => <Meal id={meal.id} key={meal.id} />)
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}