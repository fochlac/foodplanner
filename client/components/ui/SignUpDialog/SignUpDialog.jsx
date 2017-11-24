import React from 'react';
import Dialog from '../Dialog/Dialog.jsx';
import SignUpOption from './SignUpOption.jsx';
import './SignUp.less';

export default class CreateMealDialog extends React.Component {
  constructor(props) {
    super();

    this.state = props.edit ? props.signup : {
      name: props.user.name,
      options: props.meal.options.map(option => ({
          id: option.id,
          value: option.values[0] ? option.values[0] : null
        })),
      comment: ''
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
      meal: this.props.meal.id,
      options: this.state.options,
      signup: edit ? this.props.signup.id : null
    });
  }

  cancel() {
    this.props.close_dialog();
  }

  setOption(id) {
    return (newOption) => {
      let newArr = this.state.options.concat([]),
          pos = newArr.findIndex(opt => opt.id === id);

      newArr[pos] = newOption;

      this.setState({
        options: newArr
      });
    }
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
          <div>
            <label htmlFor="SignUpDialog_name">Name</label>
            <input type="text" id="SignUpDialog_name" defaultValue={p.edit ? p.signup.name : p.user.name} onChange={this.nameInput}/>
          </div>
          {p.meal.options.map(option => {
            const valueObj = this.state.options.find(opt => opt.id === option.id);
            return <SignUpOption option={option} key={option.id} value={valueObj ? valueObj : {}
          } setOption={this.setOption(option.id)} />
          })}
          <div>
            <label htmlFor="SignUpDialog_comment">Kommentar</label>
            <textarea type="text" id="SignUpDialog_comment" defaultValue={p.edit ? p.signup.comment : null} onChange={this.commentInput}></textarea>
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