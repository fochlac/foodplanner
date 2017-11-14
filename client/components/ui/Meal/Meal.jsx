import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatTime, formatTimeShort } from '../../scripts/date.js';
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

  editMeal() {
    this.props.start_edit_meal(this.props.meal.id);
  }

  cancelMeal() {
    this.props.cancel_meal(this.props.meal.id);
  }

  render() {
    if (!this.props.meal) {
      return null;
    }

    const p = this.props,
        signups = p.meal.signups.map(id => p.signups[id]);

    return (
      <div className="meal">
        <div className="titlebar"><h4 className="title">{formatDate(p.meal.time)}: {p.meal.name}</h4><span className="fa fa-lg menuIcon fa-pencil pointer" onClick={() => this.editMeal()}></span><span onClick={() => this.cancelMeal()} className="fa fa-lg menuIcon fa-trash pointer"></span></div>
        <div className="details">
          <div className="mealDetails">
            {
              p.meal.image
              ? <img src={p.meal.image} className="mealImage"/>
              : null
            }
            <p className="date">Essenszeit: <b>{formatTime(p.meal.time)}</b></p>
            <p className="date">Veranstalter: {p.meal.creator}</p>
            <p className="description">{p.meal.description}</p>
          </div>
          <div className="participants">
            <h4 className="participantsTitle">Teilnehmerliste</h4>
            {
              p.meal.signupLimit
              ? <span className="participation">{signups.length} von {p.meal.signupLimit} Teilnehmern</span>
              : <span className="participation">{signups.length} Teilnehmer</span>
            }
            <span className="deadline">Anmeldeschluss: {formatTimeShort(p.meal.deadline)}</span>
            {
              p.meal.deadline * 1000 > Date.now()
              ? <p className="fakeLink" onClick={() => this.signup()}><span>Teilnehmen</span><span className="fa fa-angle-double-right"></span></p>
              : null
            }
            <ul className="participantsList">
              {
                signups.map(signup => (
                  <li key={signup.id}>
                    <p className="user">
                      <span>{signup.name}</span>
                        <span className="icons">
                          <span className="fa fa-pencil edit" onClick={() => this.edit(signup.id)}></span>
                          <span className="fa fa-times cancel" onClick={() => this.cancel(signup.id)}></span>
                        </span>
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
