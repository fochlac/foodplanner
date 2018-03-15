const error = require(process.env.FOOD_HOME + 'modules/error'),
  caches = require(process.env.FOOD_HOME + 'modules/cache')

let checkDomainCache = caches.getCache('checkDomain')

module.exports = {
  checkDomainTaken: (req, res) => {
    const {subdomain} = req.query
    let search = checkDomainCache.get(subdomain)
    if (search) {
      res.status(200).send(search)
    } else {
      let parsedResult = {
        isValid: true,
        name: subdomain
      }
      checkDomainCache.put(subdomain, parsedResult)
      res.status(200).send(parsedResult)
    }
  },

  createInstance: (req, res) => {
    res.status(200).send({})
  },
}
