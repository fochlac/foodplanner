const log = require(process.env.FOOD_HOME + 'modules/log'),
  instanceDB = require(process.env.FOOD_HOME + 'modules/db/instance'),
  caches = require(process.env.FOOD_HOME + 'modules/cache')

const instanceCache = caches.getCache('instanceList')

module.exports = async (req, res, next) => {
  req.instance = req.params.instance

  if (!instanceCache.get(req.instance)) {
    const instanceList = await instanceDB.getAllInstances(),
      validInstance = instanceList.some(instance => +instance.id === +req.instance)

    instanceCache.put(req.instance, { valid: validInstance })
  }

  if (instanceCache.get(req.instance).valid) {
    next()
  } else {
    res.status(404).send('<html><h1>ERROR 404: Instance not found!</h1></html>')
  }
}
