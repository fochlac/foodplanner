const getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  mysql = require('mysql'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  { executeQuery } = require(process.env.FOOD_HOME + 'helper/db')

function doubleFlattenResults(result) {
  let objectResult = result.reduce((acc, row) => {
    if (acc[row.id]) {
      if (acc[row.id].options[row.mealOptionsId]) {
        acc[row.id].options[row.mealOptionsId].values.push({ name: row.mealOptionValueName, price: row.mealOptionValuePrice, id: row.mealOptionValueId })
      } else {
        acc[row.id].options[row.mealOptionsId] = {
          id: row.mealOptionsId,
          name: row.mealOptionsName,
          type: row.mealOptionsType,
          price: row.mealOptionsPrice,
          values: row.mealOptionValueName !== null ? [{ name: row.mealOptionValueName, price: row.mealOptionValuePrice, id: row.mealOptionValueId }] : [],
        }
      }
    } else {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        creator: row.creator,
        creatorId: row.creatorId,
        time: row.time,
        datefinder: row.datefinder,
        datefinderLocked: row.datefinderLocked,
        deadline: row.deadline,
        signupLimit: row.signupLimit,
        image: row.image,
        price: row.price,
        locked: row.locked,
        options:
          row.mealOptionsId !== null
            ? {
                [row.mealOptionsId]: {
                  id: row.mealOptionsId,
                  name: row.mealOptionsName,
                  type: row.mealOptionsType,
                  price: row.mealOptionsPrice,
                  values:
                    row.mealOptionValueName !== null ? [{ name: row.mealOptionValueName, price: row.mealOptionValuePrice, id: row.mealOptionValueId }] : [],
                },
              }
            : {},
      }
    }

    return acc
  }, {})

  return Object.values(objectResult).map(meal => {
    meal.options = Object.values(meal.options)
    return meal
  })
}

const getFullMealByProperty = async (prop, val) => {
  const query = `SELECT
              meals.id,
              meals.name,
              meals.description,
              meals.creator,
              meals.creatorId,
              meals.time,
              meals.datefinder,
              meals.deadline,
              meals.signupLimit,
              meals.image,
              meals.price,
              meals.locked,
              (CASE WHEN meals.datefinderLocked = 0 THEN meals.datefinder ELSE 0 END) AS datefinder,
              meals.datefinder AS datefinderLocked,
              mealOptions.id AS mealOptionsId,
              mealOptions.name AS mealOptionsName,
              mealOptions.type AS mealOptionsType,
              mealOptions.price AS mealOptionsPrice,
              mealOptionValues.name AS mealOptionValueName,
              mealOptionValues.price AS mealOptionValuePrice,
              mealOptionValues.id AS mealOptionValueId
          FROM meals
          LEFT JOIN mealOptions
          ON meals.id = mealOptions.mealId
          LEFT JOIN mealOptionValues
          ON mealOptionValues.mealOptionId = mealOptions.id
          WHERE meals.${prop} = ${val}`

  return executeQuery(await getConnection(), query, true)
    .then(result => doubleFlattenResults(result))
    .catch(err => {
      log(2, 'modules/db/meal:getFullMealByProperty', err, query)
      return Promise.reject({ status: 500, message: 'Unable to get meallist.' })
    })
}

module.exports = {
  getMealById: id => getFullMealByProperty('id', mysql.escape(id)).then(result => result[0]),

  getMealByDatefinderLocked: id => getFullMealByProperty('datefinderLocked', mysql.escape(id)).then(result => result[0]),

  getMealCreatorBySignupId: id => {
    const query = `SELECT
                meals.creatorId
            FROM meals
            RIGHT JOIN signups
            ON meals.id = signups.meal
            WHERE signups.id = ${mysql.escape(id)}`

    return getConnection().then(myDb => {
      return new Promise((resolve, reject) =>
        myDb.query(query, (err, result) => {
          myDb.release()
          if (err) {
            log(2, 'modules/db/meal:getMealBySignupId', err, query)
            reject({ status: 500, message: 'Unable to get meallist.' })
          } else {
            resolve(result[0].creatorId)
          }
        }),
      )
    })
  },

  setMealById: (id, options) => {
    const query = `UPDATE meals SET
            name        = ${mysql.escape(options.name)},
            description = ${mysql.escape(options.description)},
            time        = ${mysql.escape(options.time)},
            deadline    = ${mysql.escape(options.deadline)},
            ${options.price ? `price       = ${mysql.escape(options.price)},` : ''}
            signupLimit = ${mysql.escape(options.signupLimit)}
            ${options.image ? ', image = ' + mysql.escape('/static/images/meals/' + options.image) : ''}
            WHERE id = ${mysql.escape(id)};`,
      optionsQuery = `
                INSERT INTO mealOptions (
                    mealId,
                    name,
                    price,
                    type
                ) VALUES
                ${options.options
                  .map(
                    option => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(option.name)},
                    ${mysql.escape(option.price ? option.price : 0)},
                    ${mysql.escape(option.type)}
                )`,
                  )
                  .join(',')}
                ON DUPLICATE KEY UPDATE
                    \`name\`=VALUES(\`name\`),
                    \`type\`=VALUES(\`type\`);`,
      deleteOptionsQuery = `
                DELETE mealOptions, mealOptionValues
                FROM mealOptions
                LEFT JOIN mealOptionValues
                ON mealOptions.Id = mealOptionValues.mealOptionId
                WHERE mealOptions.mealId = ${mysql.escape(id)};
            `,
      optionsValuesQuery = optionId => `
                INSERT INTO mealOptionValues (
                    mealId,
                    mealOptionId,
                    price,
                    name
                ) VALUES
                ${options.options
                  .map((option, index) => {
                    if (!option.values.length) {
                      return false
                    }
                    return option.values
                      .map(
                        value => `(
                            ${mysql.escape(id)},
                            ${mysql.escape(+optionId + index)},
                            ${mysql.escape(value.price ? value.price : 0)},
                            ${mysql.escape(value.name)}
                        )`,
                      )
                      .join(',')
                  })
                  .filter(option => option !== false)
                  .join(',')}
                ON DUPLICATE KEY UPDATE
                    \`name\`=VALUES(\`name\`);`

    return getConnection().then(myDb => {
      return new Promise((resolve, reject) =>
        myDb.query(query, (err, result) => {
          if (err) {
            log(2, 'modules/db/meal:setMealById', err)
            reject({ status: 500, message: 'Unable to insert data.' })
          } else {
            resolve({
              id: parseInt(id),
            })
          }
        }),
      )
        .then(mealObj => {
          return new Promise((resolve, reject) => {
            myDb.query(`SELECT * FROM signups WHERE meal = ${mysql.escape(id)};`, (err, result) => {
              if (err) {
                log(2, 'modules/db/meal:setMealById.2', err, deleteOptionsQuery)
                reject({ status: 500, message: 'error getting signups' })
              } else {
                if (result.length) {
                  mealObj.ignoreOptions = true
                }
                resolve(mealObj)
                log(6, 'modules/db/meal:setMealById - meal created')
              }
            })
          })
        })
        .then(mealObj => {
          if (mealObj.ignoreOptions) {
            return Promise.resolve(mealObj)
          }
          return new Promise((resolve, reject) => {
            myDb.query(deleteOptionsQuery, (err, result) => {
              if (err) {
                log(2, 'modules/db/meal:setMealById.2', err, deleteOptionsQuery)
                reject({ status: 500, message: 'error deleting old options' })
              } else {
                resolve(mealObj)
                log(6, 'modules/db/meal:setMealById - meal created')
              }
            })
          })
        })
        .then(mealObj => {
          if (!options.options.length || mealObj.ignoreOptions) {
            mealObj.options = options.options
            return Promise.resolve(mealObj)
          }
          return new Promise((resolve, reject) => {
            myDb.query(optionsQuery, (err, result) => {
              if (err) {
                log(2, 'modules/db/meal:setMealById.3', err, optionsQuery)
                reject({ status: 500, message: 'Error creating meal' })
              } else {
                mealObj.firstOptionId = result.insertId
                mealObj.options = options.options.map((option, index) => {
                  option.id = index + +result.insertId
                  return option
                })
                resolve(mealObj)
                log(6, 'modules/db/meal:setMealById - meal created')
              }
            })
          })
        })
        .then(mealObj => {
          if (!options.options.filter(option => option.values.length).length || mealObj.ignoreOptions) {
            myDb.release()
            return Promise.resolve(mealObj.id)
          }
          return new Promise((resolve, reject) => {
            myDb.query(optionsValuesQuery(mealObj.firstOptionId), (err, result) => {
              myDb.release()
              if (err) {
                log(2, 'modules/db/meal:setMealById.4', err, optionsValuesQuery)
                reject({ status: 500, message: 'Error creating meal' })
              } else {
                resolve(mealObj.id)
                log(6, 'modules/db/meal:setMealById - meal created')
              }
            })
          })
        })
    })
  },

  deleteMealById: id => {
    const deleteOptionsQuery = `
                DELETE mealOptions, mealOptionValues
                FROM mealOptions
                LEFT JOIN mealOptionValues
                ON mealOptions.Id = mealOptionValues.mealOptionId
                WHERE mealOptions.mealId = ${mysql.escape(id)};
            `
    return getConnection().then(myDb => {
      return new Promise((resolve, reject) =>
        myDb.query(`delete from meals where id = ${mysql.escape(id)}`, (err, result) => {
          if (err) {
            log(2, 'modules/db/meal:deleteMealByProperty', err)
            reject({ status: 500, message: 'Unable to delete meal.' })
          } else {
            resolve({ result: result[0], id: id })
          }
        }),
      ).then(mealObj => {
        return new Promise((resolve, reject) => {
          myDb.query(deleteOptionsQuery, (err, result) => {
            myDb.release()
            if (err) {
              log(2, 'modules/db/meal:setMealById.2', err, query)
              reject({ status: 500, message: 'deleting old options' })
            } else {
              resolve(mealObj)
              log(6, 'modules/db/meal:setMealById - meal created')
            }
          })
        })
      })
    })
  },

  createMeal: options => {
    const query = `INSERT INTO meals (
                instance,
                name,
                description,
                creator,
                creatorId,
                time,
                deadline,
                signupLimit,
                ${options.price ? 'price,' : ''}
                ${options.datefinder ? 'datefinder,' : ''}
                image
            )
            SELECT
                ${mysql.escape(options.instance)},
                ${mysql.escape(options.name)},
                ${mysql.escape(options.description)},
                ${mysql.escape(options.creator)},
                ${mysql.escape(options.creatorId)},
                ${mysql.escape(options.time)},
                ${mysql.escape(options.deadline)},
                ${mysql.escape(options.signupLimit)},
                ${options.price ? `${mysql.escape(options.price)},` : ''}
                ${options.datefinder ? `${mysql.escape(options.datefinder)},` : ''}
                ${
                  options.image
                    ? "CONCAT( '/static/images/meals/" + options.image[0] + "', `AUTO_INCREMENT`, '" + '.' + options.image[1] + "' )"
                    : mysql.escape(undefined)
                }
            FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${process.env.FOOD_DB_NAME}' AND TABLE_NAME = 'meals'
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`,
      optionsQuery = id => `
                INSERT INTO mealOptions (
                    mealId,
                    name,
                    price,
                    type
                ) VALUES
                ${options.options
                  .map(
                    option => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(option.name)},
                    ${mysql.escape(option.price ? option.price : 0)},
                    ${mysql.escape(option.type)}
                )`,
                  )
                  .join(',')}
                ON DUPLICATE KEY UPDATE
                    \`name\`=VALUES(\`name\`),
                    \`type\`=VALUES(\`type\`);`,
      optionsValuesQuery = (id, optionId) => `
                INSERT INTO mealOptionValues (
                    mealId,
                    mealOptionId,
                    price,
                    name
                ) VALUES
                ${options.options
                  .map((option, index) => {
                    if (!option.values.length) {
                      return false
                    }
                    return option.values
                      .map(
                        value => `(
                            ${mysql.escape(id)},
                            ${mysql.escape(+optionId + index)},
                            ${mysql.escape(value.price ? value.price : 0)},
                            ${mysql.escape(value.name)}
                        )`,
                      )
                      .join(',')
                  })
                  .filter(option => option !== false)
                  .join(',')}
                ON DUPLICATE KEY UPDATE
                    \`name\`=VALUES(\`name\`);`

    return getConnection()
      .then(myDb => {
        log(6, 'modules/db/meal:createMeal - got db connection')
        return new Promise((resolve, reject) => {
          myDb.query(query, (err, result) => {
            if (err) {
              log(2, 'modules/db/meal:createMeal.2', err, query)
              reject({ status: 500, message: 'Error creating meal' })
            } else {
              resolve(result.insertId)
              log(6, 'modules/db/meal:createMeal - meal inserted')
            }
          })
        })
          .then(mealId => {
            if (!options.options.length) {
              return Promise.resolve({ mealId })
            }
            return new Promise((resolve, reject) => {
              myDb.query(optionsQuery(mealId), (err, result) => {
                if (err) {
                  log(2, 'modules/db/meal:createMeal.3', err, optionsQuery(mealId))
                  reject({ status: 500, message: 'Error creating meal' })
                } else {
                  log(6, 'modules/db/meal:createMeal - options inserted')
                  resolve({ mealId, optionId: result.insertId })
                }
              })
            })
          })
          .then(mealData => {
            if (!options.options.filter(option => option.values.length).length) {
              myDb.release()
              return Promise.resolve(mealData.mealId)
            }
            return new Promise((resolve, reject) => {
              myDb.query(optionsValuesQuery(mealData.mealId, mealData.optionId), (err, result) => {
                myDb.release()
                if (err) {
                  log(2, 'modules/db/meal:createMeal.4', err, optionsValuesQuery(mealData.mealId, mealData.optionId))
                  reject({ status: 500, message: 'Error creating meal' })
                } else {
                  resolve(mealData.mealId)
                  log(6, 'modules/db/meal:createMeal - option values inserted - meal created')
                }
              })
            })
          })
      })
      .catch(err => {
        if (err && err.status) {
          err.success = false
          return err
        }

        return error.db.codeError('modules/db/meal.js:createMeal.5', err)
      })
  },

  getAllMeals: (instance) => getFullMealByProperty('instance', instance),

  getUnsignedUsersByProp: (mealId, prop, val) => {
    return getConnection().then(myDb => {
      const query = `
                SELECT * FROM users
                WHERE instance = (SELECT instance FROM meals WHERE mealId = ${mealId})
                AND NOT users.id IN (
                SELECT users.id FROM signups
                LEFT JOIN meals
                ON signups.meal = meals.id
                LEFT JOIN users
                ON signups.userId = users.id
                WHERE meals.id = ${mysql.escape(mealId)}
                AND NOT users.id IS NULL)
                AND ${prop} = ${val};`

      return new Promise((resolve, reject) =>
        myDb.query(query, (err, result) => {
          myDb.release()
          if (err) {
            log(2, 'modules/db/meals:getUnsignedUsers', err)
            reject({ status: 500, message: 'Unable to get userlist.' })
          } else {
            resolve(result)
          }
        }),
      )
    })
  },
}
