const getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  mysql = require('mysql'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  error = require(process.env.FOOD_HOME + 'modules/error')

executeQuery = (db, query, final) => {
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

/*
  data structure
  datefinder: {
    1: {
      id: 1,
      creator: 2,
      meal: 5,
      description: "lorem ipsum lauret amour",
      deadline: 12312123123,
      uservotes: [1, 4, 5, 9],
      dates[
        {
          id: 23,
          time: 123123000,
          users: [1, 4, 5, 9]
        },
        {
          id: 24,
          time: 123123123,
          users: [1, 5, 9]
        },
        {
          id: 25,
          time: 123123456,
          users: [5, 9]
        }
      ]
    }
  }
 */

module.exports = {
  createPoll: async poll => {
    const datefinder_query = `
        INSERT INTO datefinder (
          creator,
          deadline,
          description
        ) VALUES (
          ${mysql.escape(poll.creator)},
          ${mysql.escape(poll.deadline)},
          ${mysql.escape(poll.description)}
        );`,
      dates_query = datefinder => `
        INSERT INTO datefinder_dates (
          datefinder,
          time
        ) VALUES ${poll.dates
          .map(
            date => `(
          ${mysql.escape(datefinder)},
          ${mysql.escape(date.time)}
        )`,
          )
          .join(',')};`

    const myDb = await getConnection()
    try {
      await new Promise((resolve, reject) =>
        myDb.beginTransaction(err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }),
      )

      const result = await executeQuery(myDb, datefinder_query)
      const datesResult = await executeQuery(myDb, dates_query(result.insertId), true)

      return {
        id: result.id,
        creator: poll.creator,
        deadline: poll.deadline,
        description: poll.description,
        participants: [],
        dates: [
          poll.dates.map((date, index) => ({
            id: datesResult.insertId + index,
            time: date.time,
            users: [],
          })),
        ],
      }
    } catch (err) {
      return new Promise((resolve, reject) =>
        myDb.rollback(rbErr => {
          if (rbErr) {
            log(2, 'rollback failed for errors: ', err, rbErr)
          }
          myDb.release()
          if (err.type === 1) {
            return resolve(err)
          } else {
            return reject(err)
          }
        }),
      )
    }
  },

  getPolls: async () => {
    const query = `
      SELECT JSON_OBJECT(
        'id' VALUE datefinder.id,
        'creator' VALUE datefinder.creator,
        'deadline' VALUE datefinder.deadline,
        'description' VALUE datefinder.description,
        'uservotes' VALUE (SELECT JSON_ARRAYAGG(datefinder_participants.user) FROM datefinder_participants WHERE datefinder_participants.datefinder = datefinder.id),
        'dates' VALUE (SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE datefinder_dates.id,
          'time' VALUE datefinder_dates.time,
          'users' VALUE JSON_ARRAYAGG(SELECT user FROM datefinder_signups WHERE date = datefinder_dates.id)
        )) FROM datefinder_dates WHERE datefinder_dates.datefinder =  datefinder.id)
      );



      `

    SELECT
  },
}
