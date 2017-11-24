import React from 'react';

export default class SignUpOption extends React.Component {
  constructor(props) {
    super();
  }

  setOption(type) {
    return (evt) => {
      this.props.setOption({
        ...this.props.value,
        [type]: evt.target.value
      });
    }
  }

  render() {
    const opt = this.props.option,
        val = this.props.value;

    return (
      <div>
        <label>{opt.name}</label>
        {
          ['count', 'select'].includes(opt.type)
          ? <div className="row">
            {
              opt.type === 'count'
              ? <input type="number" className="count" onChange={this.setOption('count')} defaultValue={val.count}/>
              : null
            }
            <select onChange={this.setOption('value')} defaultValue={val.value} className="optionSelect">
              {opt.values.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          : <div className="row yesNo">
            <div className="row">
              <label className="radioLabel" htmlFor={'SignUpDialog_Option_yes_' + opt.id}>Ja</label>
              <input type="radio" name={'SignUpDialog_Option_' + opt.id} id={'SignUpDialog_Option_yes_' + opt.id} onChange={this.setOption('show')} value={1} defaultChecked={val.show}/>
            </div>
            <div className="row">
              <label className="radioLabel" htmlFor={'SignUpDialog_Option_yes_' + opt.id}>Nein</label>
              <input type="radio" name={'SignUpDialog_Option_' + opt.id} id={'SignUpDialog_Option_no_' + opt.id} onChange={this.setOption('show')} value={0} defaultChecked={val.show === false}/>
            </div>
          </div>
        }
      </div>
    );
  }
}