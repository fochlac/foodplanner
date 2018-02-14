const mysql = require('mysql'),
  getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  { executeQuery, createTransaction } = require(process.env.FOOD_HOME + 'helper/db')

module.exports = {
  createDatefinder: async ({ creator, deadline, description, dates }) => {
    const datefinder_query = `
        INSERT INTO datefinder (
          creator,
          deadline,
          description
        ) VALUES (
          ${mysql.escape(creator)},
          ${mysql.escape(deadline)},
          ${mysql.escape(description)}
        );`,
      dates_query = datefinder => `
        INSERT INTO datefinder_dates (
          datefinder,
          time
        ) VALUES ${dates
          .map(
            date => `(
          ${mysql.escape(datefinder)},
          ${mysql.escape(date.time)}
        )`,
          )
          .join(',')};`

    const dbActions = async myDb => {
      const result = await executeQuery(myDb, datefinder_query)
      const datesResult = await executeQuery(myDb, dates_query(result.insertId), true)

      return {
        id: result.id,
        creator,
        deadline,
        description,
        participants: [],
        dates: [
          dates.map((date, index) => ({
            id: datesResult.insertId + index,
            time: date.time,
            users: [],
          })),
        ],
      }
    }

    return createTransaction({ dbActions, ident: 'createDatefinder' })
  },

  getDatefinders: async () => {
    const query = `
      SELECT
        id, creator, deadline, description,
        CONCAT(
        '[', (
            SELECT GROUP_CONCAT(user)
            FROM datefinder_participants
            WHERE datefinder_participants.datefinder = datefinder.id
          ), ']'
        ) AS 'uservotes',
        CONCAT( '[', (
          SELECT GROUP_CONCAT(
            JSON_OBJECT(
              'id', id,
              'time', time,
              'users', CONCAT( '[', (
                SELECT GROUP_CONCAT(user)
                FROM datefinder_signups
                WHERE date = datefinder_dates.id
                GROUP BY date
              ), ']' )
            )
          )
          FROM datefinder_dates
          WHERE datefinder_dates.datefinder = datefinder.id
          GROUP BY datefinder
        ), ']' ) AS 'dates'
      FROM datefinder;`

    return executeQuery(await getConnection(), query, true)
  },

  getDatefinderCreator: async ({id}) => {
    const query = `
      SELECT creator FROM datefinder WHERE id = ${id};`

    return executeQuery(await getConnection(), query, true)
  },

  createSignup: async ({ user, dates, datefinder }) => {
    const querySignups = `
        INSERT INTO datefinder_signups (
          user,
          date
        ) VALUES ${dates.map(
          date => `(
          ${user},
          ${date}
        )`,
        )};`,
      queryParticipant = `
        INSERT INTO datefinder_participants (
          user,
          datefinder
        ) VALUES (
          ${user},
          ${datefinder}
        );`

    const dbActions = async myDb => {
      await executeQuery(myDb, querySignups)
      await executeQuery(myDb, queryParticipant, true)

      return {}
    }

    return createTransaction({ dbActions, ident: 'createSignup' })
  },

  editSignup: ({ user, dates, datefinder }) => {
    const querySignups = `
        INSERT INTO datefinder_signups (
          user,
          date
        ) VALUES ${dates.map(
          date => `(
          ${user},
          ${date}
        )`,
        )};`,
      queryDelete = `
      DELETE FROM datefinder_signups
      WHERE user = ${user}
      AND date IN (SELECT date FROM datefinder_dates WHERE datefinder = ${datefinder});`

    const dbActions = async myDb => {
      await executeQuery(myDb, queryDelete)
      await executeQuery(myDb, querySignups, true)
      return {}
    }

    return createTransaction({ dbActions, ident: 'editSignup' })
  },

  deleteSignup: ({ user, datefinder }) => {
    const querySignups = `DELETE FROM datefinder_participants WHERE user = ${user} AND datefinder = ${datefinder};`,
      queryDelete = `
      DELETE FROM datefinder_signups
      WHERE user = ${user}
      AND date IN (SELECT date FROM datefinder_dates WHERE datefinder = ${datefinder});`

    const dbActions = async myDb => {
      await executeQuery(myDb, queryDelete)
      await executeQuery(myDb, querySignups, true)
      return {}
    }

    return createTransaction({ dbActions, ident: 'deleteSignup' })
  },

  deleteDatefinder: ({ id }) => {
    const queryBase = `DELETE FROM datefinder WHERE id = ${id};`,
      queryParticipants = `DELETE FROM datefinder_participants WHERE datefinder = ${id};`,
      queryDates = `DELETE FROM datefinder_dates WHERE datefinder = ${id};`,
      queryDatefinderOnMeal = `UPDATE meals SET datefinder = 0 WHERE datefinder = ${id};`,
      querySignups = `DELETE FROM datefinder_signups
        WHERE date IN (SELECT date FROM datefinder_dates WHERE datefinder = ${id});`

    const dbActions = async myDb => {
      await Promise.all([executeQuery(myDb, queryBase), executeQuery(myDb, queryParticipants), executeQuery(myDb, queryParticipants), executeQuery(myDb, queryDatefinderOnMeal)])
      await executeQuery(myDb, queryDates, true)
      return {}
    }

    return createTransaction({ dbActions, ident: 'deleteDatefinder' })
  },
}
