import React from 'react';
import Meal from '../../ui/Meal.js';
import './Dashboard.less';


export default class Login extends React.Component {
    constructor(props) {
        super();

        this.state = {
            filter: ['meals']
        }
    }

    setFilter(filter) {
        const newArr = [].concat(this.state.filter);

        if (newArr.includes(filter)) {
            newArr.splice(newArr.indexOf(filter), 1);
        } else {
            newArr.push(filter);
        }
        newArr.sort((a,b) => a.id - b.id)
        this.setState({filter: newArr});
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