import React from 'react';
import Meal from 'UI/Meal.js';
import UserFrame from 'UI/UserFrame.js';
import Pager from 'UI/Pager/Pager.jsx';
import './Dashboard.less';


export default class Dashboard extends React.Component {
    constructor(props) {
        super();

        this.state = {
            filter: 'meals',
        }
    }

    setFilter(filter) {
        this.setState({filter: filter});
    }

    render() {
        const mealList = this.props[this.state.filter],
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
                            Aufgrund fehlender Internetverbindung verwendet diese Seite aktuell gecachte (alte) Daten.
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
                <div className="meals">
                    <Pager size={5} top={true} bottom={true} inactive={this.state.filter === 'meals'}>
                        {
                            mealList.map((meal) => <Meal id={meal.id} key={meal.id} showPrint={this.state.filter === 'meals'} />)
                        }
                    </Pager>
                </div>
            </div>
        );
    }
}