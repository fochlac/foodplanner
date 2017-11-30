const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');

executeQuery = (db, query, final) => {
    return new Promise((resolve, reject) => db.query(query, (err, result) => {
        if (final) {
            db.release();
        }
        if (err) {
            log(2, 'modules/db/payment:executeQuery - failed executing query', query);
            reject({status: 500, message: 'Unable to execute query.'});
        } else {
            resolve(result);
        }
    }));
}


module.exports = {
    getEligibleSignups: (mealId) => {
        const query = `SELECT id FROM signups WHERE userId IS NOT NULL AND meal = ${mysql.escape(mealId)}`;

        return getConnection()
            .then (myDb => executeQuery(myDb, query, true)
                .catch(error.db.queryError(myDb, 'modules/db/payment:getEligibleSignups - error getting eligible (non-anon) signups'))
            );
    },
    getPricesByMeal: (mealId) => {
        const queryGetPrices = `
            SELECT (
                meals.price
                + SUM(mealOptions.price * signupOptions.show)
                + SUM(mealOptionValues.price * (CASE WHEN signupOptions.count IS NULL THEN 1 ELSE signupOptions.count END))
            ) AS "price",
            signups.id,
            signups.paid
            FROM signups
            LEFT JOIN meals
            ON signups.meal = meals.id
            LEFT JOIN signupOptions
            ON signupOptions.signupId = signups.id
            LEFT JOIN mealOptions
            ON signupOptions.mealOptionId = mealOptions.id
            LEFT JOIN mealOptionValues
            ON mealOptionValues.id = signupOptions.valueId
            WHERE signups.meal = ${mysql.escape(mealId)}
            GROUP BY signups.id;`;

        return getConnection()
            .then (myDb => executeQuery(myDb, queryGetPrices, true)
                .catch(error.db.queryError(3, myDb, 'modules/db/payment:getPricesByMeal - error getting prices'))
            );

    },
    payForSignup: (signupId) => {
        const queryGetPrice = `
            SELECT (
                meals.price
                + SUM(mealOptions.price * signupOptions.show)
                + SUM(mealOptionValues.price * (CASE WHEN signupOptions.count IS NULL THEN 1 ELSE signupOptions.count END))
            ) AS "sum"
            FROM signups
            LEFT JOIN meals
            ON signups.meal = meals.id
            LEFT JOIN signupOptions
            ON signupOptions.signupId = signups.id
            LEFT JOIN mealOptions
            ON signupOptions.mealOptionId = mealOptions.id
            LEFT JOIN mealOptionValues
            ON mealOptionValues.id = signupOptions.valueId
            WHERE signups.id = ${mysql.escape(signupId)}
            AND signups.paid = 0
            GROUP BY signups.id;`,
        queryGetBalance = `
            SELECT users.balance
            FROM signups
            LEFT JOIN users
            ON signups.userId = users.id
            WHERE signups.id = ${mysql.escape(signupId)};`,
        queryRemoveBalance = (price) => `
            UPDATE users
            SET users.balance = (users.balance - CASE WHEN ${mysql.escape(price)} IS NULL THEN 0 ELSE ${mysql.escape(price)} END)
            WHERE users.id = (
                SELECT signups.userId
                FROM signups
                WHERE signups.id = ${mysql.escape(signupId)}
            );`,
        queryAddBalance = (price) => `
            UPDATE users
            SET users.balance = (users.balance + CASE WHEN ${mysql.escape(price)} IS NULL THEN 0 ELSE ${mysql.escape(price)} END)
            WHERE users.id = (
                SELECT meals.creatorId
                FROM signups
                LEFT JOIN meals
                ON meals.id = signups.meal
                WHERE signups.id = ${mysql.escape(signupId)}
            );`,
        queryCreateTransaction = (price) => `
            INSERT INTO transactions (
                \`source\`,
                \`target\`,
                \`amount\`,
                \`mealId\`
            ) SELECT
                signups.userId,
                meals.creatorId,
                (CASE WHEN ${mysql.escape(price)} IS NULL THEN 0 ELSE ${mysql.escape(price)} END),
                meals.id
            FROM signups
            LEFT JOIN meals
            ON meals.id = signups.meal
            WHERE signups.id = ${mysql.escape(signupId)};`,
        querySetPaid = `UPDATE signups SET paid = 1 WHERE signups.id = ${mysql.escape(signupId)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.beginTransaction(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }))
                .then(() => Promise.all([executeQuery(myDb, queryGetPrice), executeQuery(myDb, queryGetBalance)]))
                .then((priceBalance) => {
                    const price = priceBalance[0][0].sum,
                        balance = priceBalance[1][0].balance;

                    if (price >= balance) {
                        log(2, 'modules/db/payment:payForSignup', 'stopped transaction - insufficient balance. signup: ' + signupId);
                        return Promise.reject({type: 1, status: 400, message: 'Insufficient balance.'});
                    }

                    return Promise.all([
                        executeQuery(myDb, queryRemoveBalance(price)),
                        executeQuery(myDb, queryAddBalance(price)),
                        executeQuery(myDb, queryCreateTransaction(price)),
                        executeQuery(myDb, querySetPaid)
                    ]);
                })
                .then(() => new Promise((resolve, reject) => myDb.commit(err => {
                    if (err) {
                        log(2, 'modules/db/payment:payForSignup', 'error commiting transaction');
                        reject({status: 500, message: 'Unable to commit transaction.'});
                    } else {
                        myDb.release();
                        resolve();
                    }
                })))
                .catch(err => new Promise((resolve, reject) =>  myDb.rollback(rbErr => {
                    if (rbErr) {
                        log(2, 'rollback failed for errors: ', err, rbErr);
                    }
                    myDb.release();
                    if (err.type === 1) {
                        return resolve(err);
                    } else {
                        return reject(err);
                    }
                })));
        });
    }
}