import React from 'react';
import Dialog from '../Dialog/Dialog.jsx';

export default class SignUpDialog extends React.Component {
  constructor(props) {
    super();

    this.state = {
      name: props.user.name,
      comment: props.edit ? props.signup.comment : ''
    }

    this.nameInput = this.handleInput('name').bind(this);
    this.commentInput = this.handleInput('comment').bind(this);
  }

  handleInput(field) {
    return (evt) => {
      this.setState({
        [field]: evt.target.value
      });
    };
  }

  submit() {
    const edit = this.props.edit;

    this.props[edit ? 'meal_edit' : 'meal_signup']({
      name: this.state.name,
      comment: this.state.comment,
      user: this.props.user.id,
      meal: this.props.meal.id,
      signup: edit ? this.props.signup.id : null
    });
  }

  cancel() {
    this.props.close_dialog();
  }

  render() {
    const p = this.props;

    return (
      <Dialog>
        <div className="titlebar">
          <h3>Anmeldung für: {p.meal.name}</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body">
          <div className="row">
            <label htmlFor="SignUpDialog_name">Name</label>
            <input type="text" id="SignUpDialog_name" defaultValue={p.edit ? p.signup.name : p.user.name} onChange={this.nameInput}/>
          </div>
          <div className="row">
            <label htmlFor="SignUpDialog_comment">Kommentar</label>
            <input type="text" id="SignUpDialog_comment" defaultValue={p.edit ? p.signup.comment : null} onChange={this.commentInput}/>
          </div>
        </div>
        <div className="foot">
          <button type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button type="button" onClick={this.submit.bind(this)}>{p.edit ? 'Speichern' : 'Anmelden'}</button>
        </div>
      </Dialog>
    );
  }
}