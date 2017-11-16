import React from 'react';
import Dialog from '../Dialog/Dialog.jsx';
import ImageUploader from '../ImageUploader/ImageUploader.jsx';
import DateTimePicker from 'react-datetimepicker';
import moment from 'moment';
import { formatDate, round } from '../../scripts/date.js';
import './CreateMealDialog.less';

export default class CreateMealDialog extends React.Component {
  constructor(props) {
    const tomorrow12 = moment().endOf('day').add(12, 'hours').toDate();
    super();

    this.state = props.edit ? {
      ...props.meal,
      deadline: '',
      deadlineHour: '12:00',
      timeHour: '12:00',
      time: '',
      timeObject: new Date(props.meal.time),
      deadlineObject: new Date(props.meal.deadline),
    } : {
      name: '',
      creator: '',
      image: '',
      imageUrl: '',
      description: '',
      signupLimit: 0,
      deadline: '',
      deadlineHour: '12:00',
      timeHour: '12:00',
      time: '',
      timeObject: tomorrow12,
      deadlineObject: tomorrow12
    };

    this.nameInput = this.handleInput('name').bind(this);
    this.creatorInput = this.handleInput('creator').bind(this);
    this.saveImage = this.handleInput('image').bind(this);
    this.saveImageUrl = this.handleInput('imageUrl').bind(this);
    this.descriptionInput = this.handleInput('description').bind(this);
    this.signupLimitInput = this.handleInput('signupLimit').bind(this);
    this.deadlineHourInput = this.handleInput('deadlineHour').bind(this);
    this.deadlineInput = this.handleDatepicker('deadline').bind(this);
    this.timeHourInput = this.handleInput('timeHour').bind(this);
    this.timeInput = this.handleDatepicker('time').bind(this);
  }

  handleInput(field) {
    return (evt) => {
      this.setState({
        [field]: evt.target.value
      });
    };
  }

  handleDatepicker(field) {
    return (date) => {
      let obj = {
          [field]: formatDate(date),
          [field + 'Object']: date
        };
      if (field === 'deadline' && this.state.timeObject < date) {
        obj.timeObject = date;
        obj.time =  formatDate(date);
      }
      this.setState(obj);
    };
  }

  submit() {
    const s = this.state,
      tomorrow12 = moment().endOf('day').add(12, 'hours').unix() * 1000;

    this.props[this.props.edit ? 'edit_meal' : 'create_meal']({
      id: s.id,
      name: s.name,
      creator: s.creator,
      image: s.imageUrl,
      description: s.description,
      signupLimit: s.signupLimit,
      deadline: (!s.deadline.toString().length || !s.deadlineHour.toString().length ) ? tomorrow12 : moment(s.deadline + ' ' + s.deadlineHour, 'DD.MM.YY HH:mm').unix() * 1000,
      time: (!s.time.toString().length || !s.timeHour.toString().length ) ? tomorrow12 : moment(s.time + ' ' + s.timeHour, 'DD.MM.YY HH:mm').unix() * 1000
    });
  }

  cancel() {
    this.props.close_dialog();
  }

  render() {
    const p = this.props,
          s = this.state,
          edit = p.edit;
    let times = Array(21).fill(0).map((item, index) => ('00' + (8 + Math.floor(index / 2)) + ':' + ((index % 2) ? '30' : '00')).slice(-5));

    return (
      <Dialog>
        <div className="titlebar">
          {
            edit
            ? <h3>{s.name} bearbeiten</h3>
            : <h3>Neue Mahlzeit erstellen</h3>
          }
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body createMeal">
          <div className="row">
            <div className="col">
              <div>
                <label htmlFor="SignUpDialog_name">Name</label>
                <input type="text" id="SignUpDialog_name" defaultValue={s.name} onChange={this.nameInput}/>
              </div>
              <div>
                <label htmlFor="SignUpDialog_creator">Veranstalter</label>
                <input type="text" id="SignUpDialog_creator" defaultValue={edit ? s.creator : p.user.name} onChange={this.creatorInput}/>
              </div>
            </div>
            <div className="col">
              <ImageUploader callback={(image, imageUrl) => {this.saveImage(image); this.saveImageUrl(imageUrl)}} opts={{imageUrl: s.image}}/>
            </div>
          </div>
          <div>
            <label htmlFor="SignUpDialog_comment">Beschreibung</label>
            <textarea type="text" id="SignUpDialog_description" onChange={this.descriptionInput} defaultValue={s.description}></textarea>
          </div>
          <div>
            <label htmlFor="SignUpDialog_signupLimit">Teilnehmerbegrenzung</label>
            <input type="number" id="SignUpDialog_signupLimit" defaultValue={edit ? s.signupLimit : 0} onChange={this.signupLimitInput}/>
          </div>
          <div>
            <label htmlFor="SignUpDialog_deadline">Anmeldeschluss</label>
            <div className="row">
              <DateTimePicker
                value={this.state.deadlineObject}
                onChange={this.deadlineInput}
                dateFormat='DD.MM.YY'
                time={false}
              />
              <select className="timePicker" onChange={this.deadlineHourInput} defaultValue={edit ? round(s.deadlineObject, 30).format('HH:mm') : "12:00"}>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="SignUpDialog_time">Lieferzeitpunkt</label>
            <div className="row">
              <DateTimePicker
                value={this.state.timeObject}
                onChange={this.timeInput}
                dateFormat='DD.MM.YY'
                time={false}
              />
              <select className="timePicker" onChange={this.timeHourInput} defaultValue={edit ? round(s.timeObject, 30).format('HH:mm') : "12:00"}>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="foot">
          <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button type="button" onClick={this.submit.bind(this)}>Speichern</button>
        </div>
      </Dialog>
    );
  }
}