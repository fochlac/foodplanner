const mysql = require('mysql'),
  getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  { executeQuery, createTransaction } = require(process.env.FOOD_HOME + 'helper/db')

module.exports = {
  createInstance: async ({ name, address, company, subdomain }) => {
    const datefinder_query = `
        INSERT INTO instance (
          name,
          address,
          company,
          subdomain
        ) VALUES (
          ${mysql.escape(name)},
          ${mysql.escape(address)},
          ${mysql.escape(company)},
          ${mysql.escape(subdomain)}
        );`

    const result = await executeQuery(await getConnection(), query, true)

    log(6, 'inserted new instance with id', result.insertId)

    return {
      id: result.insertId,
      name,
      address,
      company,
      subdomain,
      sprache: 'de-DE',
      titel: '',
      gmail_user: '',
      gmail_pass: '',
    }
  },

  getAllInstances: async () => {
    const datefinder_query = `SELECT * FROM INSTANCES;`

    const result = await executeQuery(await getConnection(), query, true)

    log(6, 'got all instances')

    return result
  },
}
