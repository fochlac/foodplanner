const getConnection = require(process.env.FOOD_HOME + 'modules/db'),
      log = require(process.env.FOOD_HOME + 'modules/log')

const executeQuery = (db, query, final) => {
  return new Promise((resolve, reject) =>
    db.query(query, (err, result) => {
      if (final === true) {
        log(6, 'released connection')
        db.release()
      }
      if (err) {
        log(2, 'modules/db/datefinder:executeQuery - failed executing query', query, err)
        reject({ status: 500, message: 'Unable to execute query.' })
      } else {
        resolve(result)
      }
    }),
  )
}

const createTransaction = async ({ dbActions, ident = 'defaultTransaction' }) => {
  try {
    const myDb = await getConnection()
    await new Promise((resolve, reject) =>
      myDb.beginTransaction(err => {
        if (err) {
          log('Error starting transaction: ', ident, err)
          reject(err)
        }
        resolve()
      }),
    )

    return await dbActions(myDb)
  } catch (err) {
    log('Error during transaction: ', ident, err)
    return new Promise((resolve, reject) =>
      myDb.rollback(rbErr => {
        if (rbErr) {
          log(2, 'rollback failed for errors: ', ident, err, rbErr)
        }
        myDb.release()
        if (err.type === 1) {
          return resolve(err)
        }
        return reject(err)
      }),
    )
  }
}

module.exports = {
  executeQuery,
  createTransaction,
}
