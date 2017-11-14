import React from 'react';
import {Link} from 'react-router-dom';
import {formatDate} from '../../scripts/date.js';

import Notifications from '../../ui/Notifications.js';
import ParticipationBar from '../../ui/ParticipationBar.js';

import Subtab from './Subtab.jsx';

import './Event.less';


export default class Event extends React.Component {
  constructor(props) {
    super();

    this.state = {
        detailForItem: undefined,
        descriptionMaxLength: 150,
        fullDescription: false,
        currentTab: 'tasks'
    }
  }

  show(id) {
    document.getElementById(id).scrollIntoView();
  }

  menu() {
    return {
      items: [{
        name: 'Element hinzufügen',
        submenu: [
          {
            name: 'Aufgabe anlegen',
            action: () => this.createElement('Event'),
            symbol: 'fa-clipboard'
          },{
            name: 'Umfrage anlegen',
            action: () => this.createElement('poll'),
            symbol: 'fa-pie-chart'
          },{
            name: 'Datei hinzufügen',
            action: () => this.createElement('file'),
            symbol: 'fa-file'
          },{
            name: 'Benachrichtigung hinzufügen',
            action: () => this.createElement('task'),
            symbol: 'fa-exclamation'
          }
        ]
      },{
        name: 'Event bearbeiten',
        action: () => this.editTask(),
        symbol: 'fa-pencil'
      },{
        name: 'Teilnehmer berabeiten',
        action: () => this.assignTask()
      },{
        name: 'Event absagen',
        action: () => this.deleteTask(),
        symbol: 'fa-trash'
      }]
    };
  }

  expand(id) {
    switch(id) {
      case 'description':
        return this.setState({fullDescription: true});

    }
  }

  setTab(id) {
    this.setState({currentTab: id});
  }

  render() {
    const evt = this.props.event,
      now = Date.now(),
      tasks = evt.tasks.map(taskId => this.props.tasks[taskId]),
      newTasks = tasks.filter(task => task.virgin).length,
      evtAndSubtaskFiles = evt.files.concat(...tasks.map(tasks => tasks.files)),
      newFiles = evtAndSubtaskFiles.map(fileId => this.props.files[fileId]).filter(file => file.virgin).length,
      newPolls = evt.polls.map(pollId => this.props.polls[pollId]).filter(poll => poll.virgin).length;

    if (!evt) {
      return  <Redirect to="/"/>;
    }

    return (
      <div className="event">
        <div className="eventHeader" style={{'backgroundImage': 'url(' + evt.headerImage + ')'}}>
          <div className="row">
            <div className="col">
              <h2>{evt.name}</h2>
              <h3>{evt.subtitle}</h3>
            </div>
            <div className="col">
              {
                (typeof evt.date !== 'object')
                ? <p>{formatDate(evt.date)}</p>
                : <p title={formatDate(evt.date.end)}>{formatDate(evt.date.start)}</p>
              }
              <p className="participants">{evt.participating.length} Teilnehmer</p>
            </div>
          </div>
          <ParticipationBar eventId={this.props.id} />
        </div>
        <div className="eventBody">
          {
            (evt.notifications.length)
            ? <Notifications notes={evt.notifications} />
            : null
          }
          <p className="eventDescription">
            {
              (evt.description.length)
              ? (evt.description.length > this.state.descriptionMaxLength && !this.state.fullDescription) ? evt.description.slice(0, this.state.descriptionMaxLength) : evt.description
              : 'Keine Beschreibung angegeben.'
            }
            {
              (evt.description.length && evt.description.length > this.state.descriptionMaxLength && !this.state.fullDescription)
              ? <a className="expander" onClick={() => this.expand('description')}>Mehr ...</a>
              : null
            }
          </p>
          <ul className="subtabs">
            {
              evt.tasks.length
              ? <li onClick={() => this.setTab('tasks')} className="submenuTab">Aufgaben {newTasks ? <span>{newTasks}</span> : null}</li>
              : null
            }
            <li onClick={() => this.setTab('chat')} className="submenuTab">Chat <span>{3}</span></li>
            {
              evtAndSubtaskFiles.length
              ? <li onClick={() => this.setTab('files')} className="submenuTab">Dateien {newFiles ? <span>{newFiles}</span> : null}</li>
              : null
            }
            {
              evt.polls.length
              ? <li onClick={() => this.setTab('polls')} className="submenuTab">Umfragen {newPolls ? <span>{newPolls}</span> : null}</li>
              : null
            }
          </ul>
          <Subtab type={this.state.currentTab} options={this.props} />
        </div>
      </div>
    );
  }
}