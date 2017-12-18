import React from 'react';
import sEqual from 'shallow-equals';
import dEqual from 'fast-deep-equal';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatTime, formatTimeShort, formatDayNameDate } from 'SCRIPTS/date.js';
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
    this.editPrices = props.start_edit_price.bind(this, id);

    this.edit = props.start_meal_edit.bind(this);
    this.cancel = props.meal_cancel.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextState.editable !== this.state.editable ) {
      return true;
    }
    if (
      !dEqual(nextProps.meal, this.props.meal)
      || !dEqual(nextProps.signups, this.props.signups)
      || !dEqual(nextProps.user, this.props.user)
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.meal.deadline !== prevProps.meal.deadline) {
      this.checkDeadline();
    }
  }

  componentDidMount() {
    window.addEventListener('focus', this.checkDeadline);
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.checkDeadline);
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
        signups = p.meal.signups.map(id => {
          return p.signups[id];
        }),
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
        <div className="titlebar">
          <h4 className="title">{formatDayNameDate(p.meal.time)}: <span className="name">{p.meal.name}</span></h4>
          {
            (p.user.id === p.meal.creatorId)
            ? <span className="noWrap">
              <span className="fa fa-lg menuIcon fa-euro pointer" onClick={this.editPrices}></span>
              <span className="fa fa-lg menuIcon fa-pencil pointer" onClick={this.editMeal}></span>
              <span onClick={this.cancelMeal} className="fa fa-lg menuIcon fa-trash pointer"></span>
            </span>
            : null
          }
        </div>
        <div className="details">
          <div className="mealDetails">
            {
              p.meal.image
              ? <img src={p.meal.image} className="mealImage"/>
              : null
            }
            <p className="date">Zeitpunkt: <b>{formatTime(p.meal.time)}</b></p>
            <p className="creator">Organisator: <span>{p.meal.creator}</span></p>
            <p className="description">{p.meal.description}</p>
          </div>
          <div className="participants">
            <h4 className="participantsTitle">Teilnehmerliste</h4>
            {
              p.meal.signupLimit
              ? <span className="participation"><span className="count">{signups.length}</span> von <span className="limit">{p.meal.signupLimit}</span> Teilnehmern</span>
              : <span className="participation"><span className="count">{signups.length}</span> Teilnehmer</span>
            }
            <span className="deadline">Anmeldeschluss: {formatTimeShort(p.meal.deadline)}</span>
            {
              (!s.editable || (signups.length >= p.meal.signupLimit && p.meal.signupLimit))
              ? null
              : <p className="fakeLink participate" onClick={this.signup}><span>Teilnehmen</span><span className="fa fa-angle-double-right"></span></p>
            }
            <ul className="participantsList">
              {
                signups.map(signup => (
                  <li key={signup.id}>
                    <p className="user">
                      <span className="name">{signup.name}</span>
                      {
                        signup.price
                        ? <span className="moneyFrame"><span className="money">{signup.price.toFixed(2)}</span><span className="moneySymbol">€</span></span>
                        : null
                      }
                      {
                        s.editable && (p.user.id === p.meal.creatorId || p.user.id === signup.userId)
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

                          return (mealOption.type !== 'toggle' || option.show)
                            ? <li key={option.id} className="row">
                              {
                                mealOption.type === 'count'
                                ? <span className="optionCount">{option.count}</span>
                                : null
                              }
                              {
                                (mealOption.type !== 'toggle')
                                ? <span className="optionValue">{option.value}</span>
                                : null
                              }
                              {
                                (mealOption.type === 'toggle')
                                ? <span className="optionShow">{mealOption.name}</span>
                                : null
                              }
                            </li>
                          : null
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
