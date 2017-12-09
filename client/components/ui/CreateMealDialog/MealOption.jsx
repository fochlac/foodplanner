import React from 'react';

export default class MealOption extends React.Component {
  constructor(props) {
    super();

    this.state = {
      addValue: ''
    }

    this.setAddValue = this.setAddValue.bind(this);
    this.addValue = this.addValue.bind(this);
  }

  setAddValue(evt) {
    this.setState({addValue: evt.target.value});
  }

  addValue() {
    if (!this.state.addValue.length) {
      return;
    }
    if (this.props.option.values.map(value => value.name).includes(this.state.addValue)) {
      return;
    }
    this.props.setOption({
      ...this.props.option,
      values: [...this.props.option.values, {name: this.state.addValue}]
    });
    this.setState({addValue: ''});
  }

  deleteValue(index) {
    this.props.setOption({
      ...this.props.option,
      values: this.props.option.values.filter((val, ind) => ind !== index)
    });
  }

  setOption(type) {
    return (evt) => {
      this.props.setOption({
        ...this.props.option,
        [type]: evt.target.value
      });
    }
  }

  render() {
    const opt = this.props.option,
        index = this.props.index,
        editable = this.props.editable;

    return (
    <div className="additionalOption">
      <div>
        <div className="row">
          {
            editable
            ? <span className="delLink fakeLink push-right" onClick={() => this.props.deleteOption(index)}>Löschen <span className="fa fa-trash fa-lg"></span></span>
            : null
          }
        </div>
        <div className="row">
          <div>
            <label htmlFor={"SignUpDialog_optionname_" + index}>Name</label>
            <input type="text" id={"SignUpDialog_optionname_" + index} defaultValue={opt.name} onChange={this.setOption('name')} disabled={!editable} />
          </div>
          <div className="optionType">
            <label htmlFor={"SignUpDialog_optiontype_" + index}>Optionstyp</label>
            <select id={"SignUpDialog_optiontype_" + index} defaultValue={opt.type} onChange={this.setOption('type')} disabled={!editable} >
              <option value="count">Anzahl</option>
              <option value="select">Auswahl</option>
              <option value="toggle">Ja-Nein</option>
            </select>
          </div>
        </div>
      </div>
      {
        ['count', 'select'].includes(opt.type)
        ? <div>
          <ul className="valueCloud">
            {
              opt.values.map((val, ind) => <li key={ind}>{val.name} {editable ? <span className="fa fa-times pointer" onClick={() => this.deleteValue(ind)}></span> : null}</li>)
            }
          </ul>
          <div>
            <label htmlFor={"SignUpDialog_optionvalue_" + index}>Wert</label>
            <div className="row">
              <input type="text" id={"SignUpDialog_optionvalue_" + index} onChange={this.setAddValue} value={this.state.addValue} disabled={!editable} />
              <button className="addButton" onClick={this.addValue} disabled={!editable} >Hinzufügen</button>
            </div>
          </div>
        </div>
        : null
      }
    </div>
    );
  }
}