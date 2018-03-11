const log = require(process.env.FOOD_HOME + 'modules/log')

module.exports = (type, matches, additionalOptions) => {
  const { hideError = false, nextOnError = false, nextRouterOnError = false } = additionalOptions || {}

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
    } else if (nextRouterOnError) {
      log(6, 'Invalid request, trying next router')
      next('router')
    } else {
      log(4, 'Invalid Request.', payload)
      res.status(400).send(hideError ? { type: 'Invalid_Request_Hidden', data: invalidParams } : { type: 'Invalid_Request', data: invalidParams })
    }
  }
}
