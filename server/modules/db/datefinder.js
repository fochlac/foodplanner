const mysql = require('mysql'),
  getConnection = require(process.env.FOOD_HOME + 'modules/db'),
  log = require(process.env.FOOD_HOME + 'modules/log'),
  error = require(process.env.FOOD_HOME + 'modules/error'),
  { executeQuery, createTransaction } = require(process.env.FOOD_HOME + 'helper/db')

module.exports = {
  createDatefinder: async (instance, { creator, deadline, dates }) => {
    const datefinder_query = `
        INSERT INTO datefinder (
          creator,
          deadline,
          instance
        ) VALUES (
          ${mysql.escape(creator)},
          ${mysql.escape(deadline)},
          ${mysql.escape(instance)}
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
      const datesResult = await executeQuery(myDb, dates_query(result.insertId))

      return {
        id: result.insertId,
        creator,
        deadline,
        participants: [],
        dates: dates.map((date, index) => ({
          id: datesResult.insertId + index,
          time: date.time,
          users: [],
        })),
      }
    }

    return createTransaction({ dbActions, ident: 'createDatefinder' })
  },

  getDatefinders: async instance => {
    const query = `
      SELECT
        id, creator, deadline,
        CONCAT(
        '[', (
            SELECT GROUP_CONCAT(CONCAT('{"user": ', users.id, ', "name": "', users.name, '"}'))
            FROM datefinder_participants
            LEFT JOIN users
            ON datefinder_participants.user = users.id
            WHERE datefinder_participants.datefinder = datefinder.id
          ), ']'
        ) AS 'participants',
        CONCAT( '[', (
          SELECT GROUP_CONCAT(
            JSON_OBJECT(
              'id', id,
              'time', time,
              'users', CONCAT( '[', (
                SELECT GROUP_CONCAT(CONCAT('{"user": ', users.id, ', "name": "', users.name, '"}'))
                FROM datefinder_signups
                LEFT JOIN users
                ON datefinder_signups.user = users.id
                WHERE date = datefinder_dates.id
                GROUP BY date
              ), ']' )
            )
          )
          FROM datefinder_dates
          WHERE datefinder_dates.datefinder = datefinder.id
          GROUP BY datefinder
        ), ']' ) AS 'dates'
      FROM datefinder
      WHERE instance = ${instance};`

    return executeQuery(await getConnection(), query, true)
  },

  getDatefinderCreator: async id => {
    const query = `
      SELECT creator FROM datefinder WHERE id = ${mysql.escape(id)};`

    return executeQuery(await getConnection(), query, true)
  },

  lockDatefinder: async ({ id, date }) => {
    const queryLock = `
        UPDATE meals
        SET
          datefinderLocked = 1,
          time = (SELECT time FROM datefinder_dates WHERE id = ${mysql.escape(date)}),
          deadline = (SELECT time FROM datefinder_dates WHERE id = ${mysql.escape(date)}) - deadline
        WHERE datefinder = ${mysql.escape(id)}
        AND datefinderLocked = 0;`

    return executeQuery(await getConnection(), queryLock, true)
  },

  createSignup: async ({ user, date }) => {
    const querySignups = `
        INSERT INTO datefinder_signups (
          user,
          date
        ) VALUES (
          ${mysql.escape(user)},
          ${mysql.escape(date)}
        )
        ON DUPLICATE KEY
        UPDATE user = user;`,
      queryParticipant = `
        INSERT INTO datefinder_participants (
          user,
          datefinder
        )
        SELECT
          ${mysql.escape(user)},
          datefinder.id
        FROM datefinder
        LEFT JOIN datefinder_dates
        ON datefinder.id = datefinder_dates.datefinder
        WHERE datefinder_dates.id = ${mysql.escape(date)}
        ON DUPLICATE KEY
        UPDATE user = user;`

    const dbActions = async myDb => {
      await executeQuery(myDb, querySignups)
      await executeQuery(myDb, queryParticipant)

      return {}
    }

    return createTransaction({ dbActions, ident: 'createSignup' })
  },

  deleteSignup: async ({ user, date }) => {
    const queryDelete = `
      DELETE FROM datefinder_signups
      WHERE user = ${mysql.escape(user)}
      AND date = ${mysql.escape(date)};`

    return executeQuery(await getConnection(), queryDelete, true)
  },

  addDatefinderDate: async ({ datefinder, time }) => {
    const query = `INSERT INTO datefinder_dates (
      datefinder,
      time
    ) VALUES (
      ${mysql.escape(datefinder)},
      ${mysql.escape(time)}
    )
    ON DUPLICATE KEY
    UPDATE datefinder = datefinder;`

    const result = await executeQuery(await getConnection(), query, true)

    return {
      datefinder,
      time,
      id: result.insertId,
    }
  },

  deleteDatefinderDate: async ({ datefinder, date }) => {
    const query = `DELETE FROM datefinder_dates WHERE datefinder = ${mysql.escape(datefinder)} AND id = ${mysql.escape(date)};`

    return executeQuery(await getConnection(), query, true)
  },

  setDatefinderDeadline: async ({ datefinder, deadline }) => {
    const query = `UPDATE datefinder SET deadline = ${mysql.escape(deadline)} WHERE id = ${mysql.escape(datefinder)};`
    const mealQuery = `UPDATE meals SET time = ${mysql.escape(deadline)} WHERE datefinder = ${mysql.escape(datefinder)};`

    const dbActions = myDb => {
      return Promise.all([executeQuery(myDb, query), executeQuery(myDb, mealQuery)])
    }

    return createTransaction({ dbActions, ident: 'deleteDatefinder' })
  },

  deleteDatefinder: ({ id }) => {
    const queryBase = `DELETE FROM datefinder WHERE id = ${mysql.escape(id)};`,
      queryParticipants = `DELETE FROM datefinder_participants WHERE datefinder = ${mysql.escape(id)};`,
      queryDates = `DELETE FROM datefinder_dates WHERE datefinder = ${mysql.escape(id)};`,
      queryDatefinderOnMeal = `UPDATE meals SET datefinder = 0 WHERE datefinder = ${mysql.escape(id)};`,
      querySignups = `DELETE FROM datefinder_signups
        WHERE date IN (SELECT date FROM datefinder_dates WHERE datefinder = ${mysql.escape(id)});`

    const dbActions = async myDb => {
      await Promise.all([
        executeQuery(myDb, queryBase),
        executeQuery(myDb, queryParticipants),
        executeQuery(myDb, queryParticipants),
        executeQuery(myDb, queryDatefinderOnMeal),
      ])
      await executeQuery(myDb, queryDates)
      return {}
    }

    return createTransaction({ dbActions, ident: 'deleteDatefinder' })
  },
}
