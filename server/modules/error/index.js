const log = require(process.env.FOOD_HOME + 'modules/log')

const regexp = {
  number: /^[0-9]*$/,
  bigint: /^[0-9]{0,15}$/,
  text: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]*$/,
  bool: /^(0|1|true|false)$/,
  mail: /^[\_A-Za-z0-9.\-]{1,50}@[\_A-Za-z0-9.\-]{1,50}\.[A-Za-z]{1,100}$/,
  float: /^[0-9]*([\,\.][0-9]*|)$/,
  utf8: /^([\x00-\x7F]|([\xC2-\xDF]|\xE0[\xA0-\xBF]|\xED[\x80-\x9F]|(|[\xE1-\xEC]|[\xEE-\xEF]|\xF0[\x90-\xBF]|\xF4[\x80-\x8F]|[\xF1-\xF3][\x80-\xBF])[\x80-\xBF])[\x80-\xBF])*$/,
}

module.exports = {
  default: log,

  promise: (level, message) => {
    return err => {
      log(level, message, err)
    }
  },

  validation: {
    isNumber: value => regexp.number.test(String(value)),
    isBigInt: value => regexp.bigint.test(String(value)),
    isText: value => regexp.text.test(String(value)),
    isBool: value => regexp.bool.test(String(value)),
    isMail: value => regexp.mail.test(String(value)),
    isFloat: value => regexp.float.test(String(value)),
  },

  checkError: (level, message) => {
    return err => {
      if (err) {
        log(level, message, err)
      }
    }
  },

  db: {
    codeError: (...err) => {
      log(1, ...err)
      return Promise.reject()
    },
    queryError: (level, db, message) => {
      return err => {
        db.release()
        log(level, message, err)
      }
    },
  },

  router: {
    authError: (res, ip) => {
      log(2, 'Invalid Auth Hash from IP: ' + ip)
      log(10, 'Invalid Auth Hash: ', res)

      res.status(401).send({ success: false, type: 'Authentication_Error' })
    },

    internalError: res => {
      return err => {
        if (err.status) {
          res.status(err.status).send(err)
        } else {
          log(2, 'Internal Error: ', err)
          log(10, 'Internal Error: ', res)

          res.status(500).send({ success: false, type: 'Internal_Error' })
        }
      }
    },

    validate: (type, matches, additionalOptions) => {
      const { hideError = false, nextOnError = false } = additionalOptions || {}
      return (req, res, next) => {
        let param,
          valid = true,
          payload = req[type],
          invalidParams = [],
          validateParam = (param, validation) => {
            if (typeof validation !== 'string' && !validation.test(payload[param])) {
              return false
              invalidParams.push(param)
            } else if (validation === 'object' && typeof payload[param] !== 'object') {
              return false
              invalidParams.push(param)
            } else if (validation === 'array' && !Array.isArray(payload[param])) {
              return false
              invalidParams.push(param)
            } else if (validation === 'utf8' && !regexp.utf8.test(payload[param])) {
              return false
              invalidParams.push(param)
            } else if (validation === 'jsonString') {
              try {
                JSON.parse(payload[param])
              } catch (err) {
                return false
                invalidParams.push(param)
              }
            }
            return true
          }

        Object.keys(matches).every(param => {
          if (Array.isArray(matches[param])) {
            valid = matches[param].every(validation => validateParam(param, validation))
          } else {
            valid = validateParam(param, matches[param])
          }
          log(6, `Validating ${param}: '${payload[param]}' against RegExp ${matches[param]}, result ${valid}`)
          return valid
        })

        if (valid) {
          next()
        } else if (nextOnError) {
          log(6, 'Invalid request, trying next route')
          next('route')
        } else {
          log(4, 'Invalid Request.', payload)
          res.status(400).send(hideError ? { type: 'Invalid_Request_Hidden', data: invalidParams } : { type: 'Invalid_Request', data: invalidParams })
        }
      }
    },
  },
}
