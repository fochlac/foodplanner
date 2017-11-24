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
        signups = p.meal.signups.map(id => p.signups[id]),
        summary = Object.values(signups.reduce((acc, signup) => {
          signup.options.forEach(option => {
            const mealOption = p.meal.options.find(opt => opt.id == option.id),
                count = (mealOption.type === 'count') ? option.count : (mealOption.type === 'select') ? 1 : +option.show,
                val = (mealOption.type === 'toggle') ? mealOption.name : option.value;

            if (!acc[mealOption.id]) {
              acc[mealOption.id] = {
                name: mealOption.name,
                type: mealOption.type,
                values: {
                  [val]: {
                    count: count,
                    value: (mealOption.type === 'toggle') ? '' : option.value
                  }
                }
              };
            } else if (!acc[mealOption.id].values[val]) {
              acc[mealOption.id].values[val] = {
                count: count,
                value: option.value
              };
            } else {
              acc[mealOption.id].values[val].count += count;
            }
          })
          return acc;
        }, {}));

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
              (!s.editable || (signups.length >= p.meal.signupLimit && p.meal.signupLimit))
              ? null
              : <p className="fakeLink" onClick={this.signup}><span>Teilnehmen</span><span className="fa fa-angle-double-right"></span></p>
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
                    </p>
                    <ul className="signupOptions">
                      {
                        signup.options.map(option =>{
                          const mealOption = p.meal.options.find(opt => opt.id == option.id);

                          return <li key={option.id} className="row">
                            {
                              mealOption.type === 'count'
                              ? <span className="optionCount">{option.count}</span>
                              : null
                            }
                            {
                              (mealOption.type !== 'toggle')
                              ? <span>{option.value}</span>
                              : null
                            }
                            {
                              (mealOption.type === 'toggle' && option.show)
                              ? <span>{mealOption.name}</span>
                              : null
                            }
                          </li>
                        })
                      }
                    </ul>
                    <p className="comment">{signup.comment}</p>
                  </li>
                ))
              }
            </ul>
            {
              summary.length
              ? <div className="summary">
                {
                  summary.map((mealOption, index) =>
                  <span key={index} className="optionGroup">
                    <b className="optionTitle">{mealOption.name}:</b>
                    {
                      Object.values(mealOption.values).map((option, index) =>
                        <span key={index} className="optionItem">
                          <span className="optionCount">{option.count}</span>
                          <span>{option.value}</span>
                        </span>)
                    }
                  </span>)
                }
              </div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}
