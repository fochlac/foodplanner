import './CreateMealDialog.less'

import { formatDate, formatTime, round } from 'UTILS/date.js'

import DateFinderOption from './DateFinderOption'
import DayTimePicker from 'UI/DayTimePicker/DayTimePicker'
import Dialog from 'UI/Dialog.js'
import ImageUploader from 'UI/ImageUploader/ImageUploader.jsx'
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import MealOption from './MealOption.jsx'
import React from 'react'
import dEqual from 'fast-deep-equal'
import { formDataFromObject } from 'UTILS/formData.js'
import sEqual from 'shallow-equals'

var wording = {
  dateHeadline: 'Termin',
  invalidHead: 'Ungültiger Termin!',
  invalidText: 'Dieser Termin ist leider nicht mehr verfügbar.',
  newHeadline: 'Neuen Termin erstellen',
  name: 'Name',
  limit: 'Teilnehmerbegrenzung',
  description: 'Beschreibung',
  deadline: 'Anmeldeschluss',
  time: 'Lieferzeitpunkt',
  addOption: 'Option hinzufügen',
  close: 'Schließen',
  cancel: 'Abbrechen',
  save: 'Speichern',
  editHeadline: name => name + ' bearbeiten',
  loadOption: 'Optionen laden',
  additionalOptions: 'Teilnahmeoptionen',
  dateType: 'Datumstyp',
  predefDate: 'Festes Datum',
  useDatefinder: 'Datumsumfrage',
  linkInfo: 'Um Links einzubinden, können Sie Markdown verwenden: [Linkname](http://www.link.de)',
}

export default class CreateMealDialog extends React.Component {
  constructor(props) {
    const deadline = new Date(props.meal.deadline),
      time = new Date(props.meal.time)
    super()

    this.tomorrow12 = new Date()
    this.tomorrow12.setDate(this.tomorrow12.getDate() + 1)
    this.tomorrow12.setHours(12)
    this.tomorrow12.setMinutes(0)
    this.tomorrow12.setSeconds(0)

    if (props.app.dialog.state) {
      this.state = props.app.dialog.state
    } else if (props.edit) {
      this.state = {
        ...props.meal,
        options: props.meal.options ? props.meal.options : [],
        time: time,
        deadline: deadline,
        dateType: props.meal.datefinder ? 'datefinder' : 'predef',
        datefinder: props.datefinder ? { ...props.datefinder, meal_deadline: props.deadline } : {},
      }
    } else {
      this.state = {
        name: '',
        creator: props.user.name,
        creatorId: props.user.id,
        image: '',
        imageUrl: '',
        description: '',
        signupLimit: 0,
        time: this.tomorrow12,
        deadline: this.tomorrow12,
        options: [],
        dateType: 'predef',
        datefinder: {},
      }
    }

    this.nameInput = this.handleInput('name').bind(this)
    this.creatorInput = this.handleInput('creator').bind(this)
    this.datefinderOutput = this.handleOutput('datefinder').bind(this)
    this.descriptionInput = this.handleInput('description').bind(this)
    this.signupLimitInput = this.handleInput('signupLimit').bind(this)
    this.deadlineInput = this.handleOutput('deadline').bind(this)
    this.timeInput = this.handleOutput('time').bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleDateType = this.handleInput('dateType').bind(this)

    this.mySetState = function(data, cb) {
      this.setState(data, () => {
        const app = history && history.state && history.state.app ? history.state.app : {}
        history.replaceState({ app: { ...app, dialog: { ...(app.dialog ? app.dialog : {}), state: this.state } } }, document.title, document.location.pathname)
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.time !== this.state.time ||
      nextState.deadline !== this.state.deadline ||
      nextState.image !== this.state.image ||
      nextState.dateType !== this.state.dateType ||
      !sEqual(nextState.options, this.state.options)
    ) {
      return true
    }
    if (!sEqual(nextProps.meals, this.props.meals)) {
      return true
    }
    return false
  }

  handleInput(field) {
    return evt => {
      this.mySetState({
        [field]: evt.target.value,
      })
    }
  }

  handleOutput(field) {
    return value => {
      this.mySetState({
        [field]: value,
      })
    }
  }

  handleImage(imageData, objectUrl) {
    this.mySetState({ imageData })
  }

  submit() {
    const s = this.state,
      data = {
        id: s.id,
        name: s.name,
        creator: s.creator,
        creatorId: s.creatorId,
        image: s.image,
        imageData: s.imageData,
        description: s.description,
        signupLimit: s.signupLimit,
        deadline: s.deadline.getTime(),
        time: s.time.getTime(),
        options: JSON.stringify(s.options),
        datefinder: JSON.stringify(s.dateType === 'datefinder' ? s.datefinder : {}),
      },
      formData = formDataFromObject(data)

    if (this.props.edit) {
      this.props.edit_meal(s.id, formData)
    } else {
      this.props.create_meal(formData)
    }
  }

  cancel() {
    this.props.close_dialog()
  }

  setOption(index) {
    return newOption => {
      let newArr = [...this.state.options]
      newArr[index] = newOption

      this.mySetState({
        options: newArr,
      })
    }
  }

  addOption() {
    this.mySetState({
      options: [
        ...this.state.options,
        {
          name: '',
          type: 'select',
          values: [],
        },
      ],
    })
  }

  deleteOption(index) {
    this.mySetState({
      options: this.state.options.filter((val, ind) => ind !== index),
    })
  }

  selectOptions(evt) {
    if (evt.target.value != -1) {
      const options = this.props.meals.find(meal => meal.id == evt.target.value).options.map(option => {
        let newOptions = Object.assign({}, option)
        newOptions.values = [].concat(option.values)
        return newOptions
      })

      this.mySetState({ options })
    }
  }

  render() {
    const p = this.props,
      s = this.state,
      edit = p.edit
    let times = Array(48)
      .fill(0)
      .map((item, index) => ('00' + Math.floor(index / 2) + ':' + (index % 2 ? '30' : '00')).slice(-5))

    if (this.props.invalid) {
      return (
        <Dialog className="CreateMealDialog">
          <div className="titlebar">
            <h3>{wording.invalidHead}</h3>
            <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
          </div>
          <div className="body">
            <p>{wording.invalidText}</p>
          </div>
          <div className="foot">
            <button type="button" className="cancel" onClick={this.cancel.bind(this)}>
              {wording.close}
            </button>
          </div>
        </Dialog>
      )
    }

    return (
      <Dialog>
        <div className="titlebar">
          {edit ? <h3>{wording.editHeadline(s.name)}</h3> : <h3>{wording.dateHeadline}</h3>}
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body createMeal">
          <div className="row responsive">
            <div className="col">
              <div>
                <label htmlFor="CreateMealDialog_name">{wording.name}</label>
                <input type="text" id="CreateMealDialog_name" defaultValue={s.name} onChange={this.nameInput} />
              </div>
              <div>
                <label htmlFor="CreateMealDialog_signupLimit">{wording.limit}</label>
                <input type="number" id="CreateMealDialog_signupLimit" defaultValue={edit ? s.signupLimit : 0} onChange={this.signupLimitInput} />
              </div>
            </div>
            <div className="col">
              <ImageUploader callback={this.handleImage} opts={{ imageUrl: this.state.image }} />
            </div>
          </div>
          <div>
            <label htmlFor="CreateMealDialog_comment">
              {wording.description}
              <InfoBubble style={{ bottom: '-60px', right: '26px', width: '180px' }} arrow="left">
                {wording.linkInfo}
              </InfoBubble>
            </label>
            <textarea type="text" id="CreateMealDialog_description" onChange={this.descriptionInput} defaultValue={s.description} />
          </div>
          <h4 className="sectionHead">{wording.dateHeadline}</h4>
          {!edit ? (
            <div>
              <label htmlFor="">{wording.dateType}</label>
              <div className="row dateType marginTop">
                <div className="row marginRight">
                  <label htmlFor="SignUpDialog_predefDate" className="inlineLabel">
                    {wording.predefDate}
                  </label>
                  <input
                    type="radio"
                    name="dateType"
                    value="predef"
                    id="SignUpDialog_predefDate"
                    onChange={this.handleDateType}
                    checked={s.dateType === 'predef'}
                  />
                </div>
                <div className="row">
                  <label htmlFor="SignUpDialog_datefinder" className="inlineLabel">
                    {wording.useDatefinder}
                  </label>
                  <input
                    type="radio"
                    name="dateType"
                    value="datefinder"
                    id="SignUpDialog_datefinder"
                    onChange={this.handleDateType}
                    checked={s.dateType === 'datefinder'}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <label htmlFor="">{wording.dateType}:</label>
              <label htmlFor="" className="inlineLabel marginLeft marginTop">
                {s.dateType === 'predef' ? wording.predefDate : wording.useDatefinder}
              </label>
            </div>
          )}

          {s.dateType === 'predef' ? (
            <div className="predfinedTime">
              <div>
                <label htmlFor="SignUpDialog_deadline">{wording.deadline}</label>
                <DayTimePicker className="deadline" onChange={this.deadlineInput} time={s.deadline} />
              </div>
              <div>
                <label htmlFor="SignUpDialog_time">{wording.time}</label>
                <DayTimePicker className="time" onChange={this.timeInput} time={s.time} />
              </div>
            </div>
          ) : (
            <DateFinderOption onChange={this.datefinderOutput} datefinder={s.datefinder} editable={!edit} />
          )}
          <h4 className="sectionHead">{wording.additionalOptions}</h4>
          {s.options.map((option, index) => (
            <MealOption
              key={index}
              option={option}
              index={index}
              setOption={this.setOption(index)}
              deleteOption={() => this.deleteOption(index)}
              editable={!edit || !p.meal.signups.length}
            />
          ))}
          {!edit || !p.meal.signups.length ? (
            <div className="row responsive">
              <p className="fakeLink addOption" onClick={this.addOption.bind(this)}>
                <span className="fa fa-plus fa-lg marginRight" />
                {wording.addOption}
              </p>
              {!s.options.length ? (
                <select className="push-right templateSelector" onChange={this.selectOptions.bind(this)}>
                  <option value="-1">Optionen laden</option>
                  {p.meals
                    .filter(meal => meal.options.length)
                    .sort((a, b) => b.time - a.time)
                    .reduce((uniqueMeals, meal) => {
                      // clean unneccesary ids to allow comparing options
                      const cleanedMealOptions = JSON.parse(JSON.stringify(meal.options).replace(/("id":[0-9]*,)|(,"id":[0-9]*)/g, ''))
                      // if no equivalent mealoptions is in unique mealoptions list, add meal with cleaned options
                      if (!uniqueMeals.some(uniqueMeal => dEqual(uniqueMeal.options, cleanedMealOptions))) {
                        uniqueMeals.push({ ...meal, options: cleanedMealOptions })
                      }
                      return uniqueMeals
                    }, [])
                    .map(meal => (
                      <option value={meal.id} key={meal.id}>
                        {meal.name}
                      </option>
                    ))}
                </select>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
            {wording.cancel}
          </button>
          <button className="submit" type="button" onClick={this.submit.bind(this)}>
            {wording.save}
          </button>
        </div>
      </Dialog>
    )
  }
}
