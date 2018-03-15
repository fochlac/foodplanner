import AddDateDialog from 'UI/AddDateDialog.js'
import ConfirmationDialog from 'UI/ConfirmationDialog.js'
import CreateMealDialog from 'UI/CreateMealDialog.js'
import ImpressumDialog from 'UI/ImpressumDialog.js'
import IncomingPaymentsDialog from 'UI/IncomingPaymentsDialog.js'
import LoginDialog from 'UI/LoginDialog.js'
import PriceDialog from 'UI/PriceDialog.js'
import PrintDialog from 'UI/PrintDialog.js'
import React from 'react'
import SendMoneyDialog from 'UI/SendMoneyDialog.js'
import SettingsDialog from 'UI/SettingsDialog.js'
import SignUpDialog from 'UI/SignUpDialog.js'
import TransactionDialog from 'UI/TransactionDialog.js'

const wording = {
  unsubscribe1: 'Erfolgreich von Emails ',
  unsubscribe2: ' abgemeldet.',
  unsubscribe_deadline: 'zur Erinnerung bei Ablauf der Anmeldefrist',
  unsubscribe_create: 'zur Benachrichtigung bei einem neuem Angebot',
  unsubscribeAll: 'Erfolgreich von allen E-Mail-Benachrichtigungen abgemeldet.',
  confirmDeleteMeal: 'Bist du dir sicher, dass du dieses Angebot löschen möchtest?',
  confirmDeleteDate: 'Bist du dir sicher, dass du diesen Termin löschen möchtest?',
}

export default class DialogController extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    const d = this.props.dialog
    let message

    switch (d.type) {
      case 'MEAL_EDIT':
        return <SignUpDialog type="edit" id={d.option.signup} />

      case 'MEAL_SIGNUP':
        return <SignUpDialog type="empty" id={d.option.meal} />

      case 'CREATE_MEAL':
        return <CreateMealDialog />

      case 'EDIT_MEAL':
        return <CreateMealDialog type="edit" id={d.option.meal} />

      case 'SEND_MONEY':
        return <SendMoneyDialog />

      case 'EDIT_PRICE':
        return <PriceDialog id={d.option.meal} />

      case 'SUBSCRIBE':
        return <SettingsDialog />

      case 'OPEN_TRANSACTIONS':
        return <TransactionDialog />

      case 'UNSUBSCRIBE':
        if (dialog.content === 'all') {
          message = wording.unsubscribeAll
        } else {
          message =
            wording.unsubscribe1 + (dialog.content === 'deadlineReminder' ? wording.unsubscribe_deadline : wording.unsubscribe_create) + wording.unsubscribe2
        }

        return <ConfirmationDialog message={message} action="save_settings_locally" parameter={dialog.params} noCancel={true} />
      case 'OPEN_SETTINGS':
        return <SettingsDialog />

      case 'OPEN_IMPRESSUM':
        return <ImpressumDialog />

      case 'CANCEL_MEAL':
        return <ConfirmationDialog message={wording.confirmDeleteMeal} action="cancel_meal" parameter={[d.option.meal]} />

      case 'DATEFINDER_DELETE_DATE':
        return <ConfirmationDialog message={wording.confirmDeleteDate} action="datefinderDeleteDate" parameter={[d.option.datefinder, d.option.date]} />

      case 'DATEFINDER_ADD_DATE':
        return <AddDateDialog datefinder={d.option.datefinder} />

      case 'PRINT_MEAL':
        return <PrintDialog />

      case 'INCOMING_PAYMENTS':
        return <IncomingPaymentsDialog />

      case 'LOGIN':
        return <LoginDialog hideRegister={d.option.hideRegister}/>

      default:
        return null
    }
  }
}
