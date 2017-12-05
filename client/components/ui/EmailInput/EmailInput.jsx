import React from 'react';
import './EmailInput.less';

export default class EmailInput extends React.Component {
  constructor(props) {
    super();

    this.state = {
          mail: '',
          id: props.id ? props.id : 'email_input_' + Date.now()
        };

    this.handleMailInput = this.handleMailInput.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.app.mailSuggestion !== this.props.app.mailSuggestion) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.mailSuggestion && nextProps.app.mailSuggestion !== this.props.app.mailSuggestion) {
      this.setState({mail: nextProps.app.mailSuggestion.mail});
      document.getElementById(this.state.id).blur();
    }
  }

  handleMailInput(evt) {
    const value = evt.target.value;
    this.setState({
      'mail': value
    }, () => {
      if (value.length > 4 && !this.timeout) {
        this.timeout = value;

        // check mail and block for 300ms
        this.showTimeout = setTimeout(() => {
          // check if mail changed during timeout; if so, recheck
          if (this.state.mail !== this.timeout) {
            // clear blocker
            this.timeout = false;
            this.handleMailInput({target: {value: this.state.mail}});
          } else {
            // clear blocker
            this.timeout = false;
          }
        }, 300);

        this.props.check_mail(value);
      }
    });
  }

  render() {
    const s = this.state;

    return (
      <div className="mailFrame">
        <div className="row">
          <input type="text" id={this.state.id} value={s.mail} onChange={this.handleMailInput} autoComplete="off" placeholder="E-Mail" />
          <span className={'fa fa-lg fa-fw fa-spin fa-spinner' + (this.props.app.hiddenBusy ? '' : ' invisible')}></span>
        </div>
      </div>
    );
  }
}
