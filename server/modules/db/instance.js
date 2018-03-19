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
      lang: 'de-DE',
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

  setPropsById: async (id, props) => {
    const updateList = Object.keys(props)
      .filter(prop => props[prop])
      .map(prop => `${mysql.escapeId(prop)} = ${mysql.escape(props[prop])}`)
      .join(', ')
    const queryUpdate = `UPDATE instances SET ${updateList} WHERE id = ${id};`
    const queryInstance = `SELECT * FROM instances WHERE id = ${id};`

    const dbActions = async myDb => {
      await executeQuery(myDb, queryUpdate)
      const [result] = await executeQuery(myDb, queryInstance)

      return result
    }

    return createTransaction({ dbActions, ident: 'db/instance.js:setPropsById' })
  },
}
