import JSONForm from './JSONForm/JSONForm.jsx'
import React from 'react'
import { connect } from 'react-redux'
import { submitForm } from 'STORE/actions.js'

export default connect(() => ({}), { submitForm })(JSONForm)

export { FormConnector } from './JSONForm/JSONForm.jsx'
