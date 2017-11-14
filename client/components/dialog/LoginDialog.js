import { close_dialog, regiser, register, sign_in } from 'STORE/actions.js'

import LoginDialog from './LoginDialog/LoginDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({ ...ownProps })

export default connect(mapStateToProps, { sign_in, regiser, close_dialog, register })(LoginDialog)
