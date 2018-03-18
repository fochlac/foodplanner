const mysql = require('mysql'),
  getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  { executeQuery, createTransaction } = require(process.env.FOOD_HOME + 'helper/db')

module.exports = {
  createInstance: async ({ name, address, company, subdomain }) => {
    const query = `
        INSERT INTO instances (
          name,
          title,
          address,
          company,
          subdomain
        ) VALUES (
          ${mysql.escape(name)},
          ${mysql.escape(subdomain)},
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
      title: subdomain,
      gmail_user: '',
      gmail_pass: '',
      icon: 'fa-calendar',
    }
  },

  getAllInstances: async () => {
    const query = `SELECT * FROM instances;`

    const result = await executeQuery(await getConnection(), query, true)

    log(6, 'got all instances')

    return result
  },

  getInstanceById: async id => {
    const query = `SELECT * FROM instances WHERE id = ${id};`

    const result = await executeQuery(await getConnection(), query, true)

    log(6, 'got all instances')

    return result[0]
  },

  deleteInstanceById: async id => {
    const query = `DELETE FROM instances WHERE id = ${id};`

    const result = await executeQuery(await getConnection(), query, true)

    log(6, 'deleted instance ', id)

    return result[0]
  },
}
