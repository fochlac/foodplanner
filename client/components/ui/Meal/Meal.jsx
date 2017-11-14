import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatTime } from '../../scripts/date.js';
import './Meal.less';

export default class Meal extends React.Component {
  constructor(props) {
    super();
  }

  edit(id) {
    this.props.start_meal_edit(id);
  }

  cancel(id) {
    this.props.meal_cancel(id);
  }

  signup() {
    this.props.start_meal_signup(this.props.meal.id);
  }

  render() {
    const p = this.props,
        signups = p.meal.signups.map(id => p.signups[id]);

    return (
      <div className="meal">
        <div className="titlebar"><h4 className="title">{formatDate(p.meal.time)}: {p.meal.name}</h4></div>
        <div className="details">
          <div className="mealDetails">
            {
              p.meal.image
              ? <img src={p.meal.image} className="mealImage"/>
              : null
            }
            <p className="date">Essenszeit: <b>{formatTime(p.meal.time)}</b></p>
            <p className="description">{p.meal.description}</p>
          </div>
          <div className="participants">
            <h4 className="participantsTitle">Teilnehmerliste</h4>
            {
              p.meal.signupLimit
              ? <span className="participation">{p.meal.signups.length} von {p.meal.signupLimit} Teilnehmern</span>
              : <span className="participation">{p.meal.signups.length} Teilnehmer</span>
            }
            <span className="deadline">Anmeldeschluss: {formatDateTime(p.meal.deadline)}</span>
            {
              p.meal.deadline > Date.now()
              ? <p className="fakeLink" onClick={() => this.signup()}><span>Teilnehmen</span><span className="fa fa-angle-double-right"></span></p>
              : null
            }
            <ul className="participantsList">
              {
                signups.map(signup => (
                  <li key={signup.id}>
                    <p className="user">
                      <span>{signup.name}</span>
                      {
                        (signup.user === p.user.id || 1)
                        ? (
                            <span className="icons">
                              <span className="fa fa-pencil edit" onClick={() => this.edit(signup.id)}></span>
                              <span className="fa fa-times cancel" onClick={() => this.cancel(signup.id)}></span>
                            </span>)
                        : null
                      }
                      {
                        signup.changing
                        ? <span className="fa fa-spinner fa-spin fa-lg fa-fw"></span>
                        : null
                      }
                    </p>
                    <p className="comment">{signup.comment}</p>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
