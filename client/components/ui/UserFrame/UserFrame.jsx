import React from 'react';
import './UserFrame.less';
import EmailInput from 'UI/EmailInput.js';


export default class UserFrame extends React.Component {
    constructor(props) {
        super();
        this.state = {
            register: false,
            name: '',
            mail: ''
        }

        this.nameInput = this.handleInput('name').bind(this);
        this.mailInput = this.handleInput('mail').bind(this);
    }

    submit() {
        if (this.state.register && this.state.name.length && this.state.mail.length) {
            this.props.save_settings(Object.assign({creationNotice_mail: 0, deadlineReminder_mail: 0}, this.props.user, {name: this.state.name, mail: this.state.mail}));
            this.setState({
                register: false,
                name: '',
                mail: ''
            });
        } else if (!this.state.register && this.props.app.mailSuggestion) {
            this.props.save_settings_locally(this.props.app.mailSuggestion);
            this.setState({
                register: false,
                name: '',
                mail: ''
            });
        }
    }


    handleInput(field) {
        return (evt) => {
            this.setState({
                [field]: evt.target.value
            });
        };
    }

    render() {
        const u = this.props.user;
        if (!u.id) {
            return (
                <div className="userFrame register">
                    {
                        this.state.register
                        ? <div className="register">
                            <input className="name" type="text" placeholder="Name" onChange={this.nameInput}/>
                            <input className="mail" type="text" placeholder="E-Mail" onChange={this.mailInput}/>
                        </div>
                        : <EmailInput />
                    }

                    <button onClick={this.submit.bind(this)}>{ this.state.register ? 'Registrieren' : 'Anmelden' }</button>
                    {
                        this.state.register
                        ? <span className="fakeLink signinLink" onClick={this.setState.bind(this, {register: false}, null)}>Anmelden</span>
                        : <span className="fakeLink registerLink" onClick={this.setState.bind(this, {register: true}, null)}>Registrieren</span>
                    }
                </div>
            );
        }

        return (
            <div className="userFrame">
                <span>
                    <span>
                        <span>
                            <div className="userDescription">Angemeldet als:</div>
                            <div className="userName">{u.name}</div>
                        </span>
                        {
                            u.admin ? <div className="role">Administrator</div> : null
                        }
                    </span>
                    <div className="balance noWrap"><span>Guthaben: </span><b>{u.balance ? u.balance.toFixed(2) : 0.00}</b><span className="moneySymbol">€</span></div>
                </span>
                <span>
                    <div className="fakeLink historyLink" onClick={this.props.show_transaction_history.bind(this, u.id)}>Kontoauszug</div>
                    <div className="fakeLink userManagementLink noWrap" onClick={this.props.start_send_money.bind(this)}>Geld senden</div>
                </span>
            </div>
        );
    }
}