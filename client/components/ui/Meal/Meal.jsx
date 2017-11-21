import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatTime, formatTimeShort } from '../../scripts/date.js';
import './Meal.less';

export default class Meal extends React.Component {
  constructor(props) {
    super();
    let id = props.meal.id;

    this.state = {
      editable: (props.meal.deadline > Date.now())
    }

    this.checkDeadline = this.checkDeadline.bind(this);
    this.editMeal = props.start_edit_meal.bind(this, id);
    this.signup = props.start_meal_signup.bind(this, id);
    this.cancelMeal = props.start_cancel_meal.bind(this, id);

    this.edit = props.start_meal_edit.bind(this);
    this.cancel = props.meal_cancel.bind(this);
  }

  componentDidMount() {
    window.addEventListener('focus', this.checkDeadline)
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.checkDeadline)
  }

  checkDeadline() {
    if (this.state.editable !== (this.props.meal.deadline > Date.now())) {
      this.setState({
        editable: (this.props.meal.deadline > Date.now())
      });
    }
  }

  render() {
    if (!this.props.meal) {
      return null;
    }

    const p = this.props,
        s = this.state,
        signups = p.meal.signups.map(id => p.signups[id]);

    return (
      <div className="meal">
        <div className="titlebar"><h4 className="title">{formatDate(p.meal.time)}: {p.meal.name}</h4><span className="fa fa-lg menuIcon fa-pencil pointer" onClick={this.editMeal}></span><span onClick={this.cancelMeal} className="fa fa-lg menuIcon fa-trash pointer"></span></div>
        <div className="details">
          <div className="mealDetails">
            {
              p.meal.image
              ? <img src={p.meal.image} className="mealImage"/>
              : null
            }
            <p className="date">Zeitpunkt: <b>{formatTime(p.meal.time)}</b></p>
            <p className="date">Organisator: {p.meal.creator}</p>
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
              (s.editable && (!p.meal.signupLimit) || signups.length < p.meal.signupLimit)
              ? <p className="fakeLink" onClick={this.signup}><span>Teilnehmen</span><span className="fa fa-angle-double-right"></span></p>
              : null
            }
            <ul className="participantsList">
              {
                signups.map(signup => (
                  <li key={signup.id}>
                    <p className="user">
                      <span>{signup.name}</span>
                      {
                        s.editable
                        ? <span className="icons">
                          <span className="fa fa-pencil edit" onClick={() => this.edit(signup.id)}></span>
                          <span className="fa fa-times cancel" onClick={() => this.cancel(signup.id)}></span>
                        </span>
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
