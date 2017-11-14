import React from 'react';
import Meal from '../../ui/Meal.js';
import './Dashboard.less';


export default class Login extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="dashboard">
                {this.props.meals.map((meal) =>
                    <Meal id={meal.id} key={meal.id} />
                )}
            </div>
        );
    }
}