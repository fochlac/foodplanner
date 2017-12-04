const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');

executeQuery = (db, query, final) => {
    return new Promise((resolve, reject) => db.query(query, (err, result) => {
        if (final === true) {
            log(6, 'released connection');
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
        const query = `
            SELECT signups.id
            FROM signups
            LEFT JOIN meals
            ON meals.id = ${mysql.escape(mealId)}
            WHERE signups.userId IS NOT NULL
            AND signups.meal = ${mysql.escape(mealId)}
            AND meals.deadline < ${Date.now()}`;

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
            SELECT
                price,
                paid
            FROM signups
            WHERE id = ${mysql.escape(signupId)};`,
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
                    const price = priceBalance[0][0].price,
                        paid = priceBalance[0][0].paid,
                        balance = priceBalance[1][0].balance;

                    if (+price >= +balance) {
                        log(2, 'modules/db/payment:payForSignup', 'stopped transaction - insufficient balance. signup: ' + signupId);
                        return Promise.reject({type: 1, status: 400, message: 'Insufficient balance.'});
                    }
                    if (paid) {
                        log(2, 'modules/db/payment:payForSignup', 'stopped transaction - already paid. signup: ' + signupId);
                        return Promise.reject({type: 1, status: 400, message: 'Already paid.'});
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
                        log(6, 'modules/db/payment:payForSignup', 'commited transaction')
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
    },

    lockMealPrices: (mealId) => {
        const queryLockPrices = `
                UPDATE meals
                SET meals.locked = 1
                WHERE meals.id = ${mysql.escape(mealId)};`,
            querySetPrice = `
                UPDATE signups
                    LEFT JOIN (
                        SELECT (
                                meals.price
                                + (CASE WHEN SUM(mealOptions.price * signupOptions.show) IS NULL THEN 0 ELSE SUM(mealOptions.price * signupOptions.show) END)
                                + (CASE WHEN SUM(mealOptionValues.price * (CASE WHEN signupOptions.count IS NULL THEN 1 ELSE signupOptions.count END)) IS NULL THEN 0 ELSE SUM(mealOptionValues.price * (CASE WHEN signupOptions.count IS NULL THEN 1 ELSE signupOptions.count END)) END)
                            ) AS sum,
                            signups.id AS id
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
                        GROUP BY signups.id
                    ) AS sum
                    ON signups.id = sum.id
                set signups.price = (CASE WHEN sum.sum IS NULL THEN 0 ELSE sum.sum END)
                WHERE signups.meal = ${mysql.escape(mealId)};`;

        return getConnection()
            .then(myDb => {
                return executeQuery(myDb, queryLockPrices)
                    .then(() => { return executeQuery(myDb, querySetPrice, true)})
                    .catch(err => {
                        log(3, 'modules/db/payment:lockMealPrices', 'error locking prices');
                        myDb.release();
                        return Promise.reject(err);
                    });
            });
    },

    setPrices: (prices) => {
        const mealQuery = (db, id, price) => `
            UPDATE ${mysql.escapeId(db)}
            SET ${mysql.escapeId(db)}.price = ${mysql.escape(price)}
            WHERE ${mysql.escapeId(db)}.id = ${mysql.escape(id)}
            AND NOT 1 = ${
                (db === 'meals')
                ? 'meals.locked'
                : (db === 'mealOptions')
                    ? `(SELECT meals.locked from meals WHERE mealOptions.mealId = meals.id)`
                    : `(SELECT meals.locked from meals WHERE mealOptionValues.mealId = meals.id)`
            };`;

        return getConnection()
        .then (myDb => {

            return new Promise((resolve, reject) => myDb.beginTransaction(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }))
                .then(() => Promise.all(prices.map(priceObj => executeQuery(myDb, mealQuery(priceObj.db, priceObj.id, priceObj.price)))))
                .then(() => new Promise((resolve, reject) => myDb.commit(err => {
                    if (err) {
                        log(2, 'modules/db/payment:setPrices', 'error commiting transaction');
                        reject({status: 500, message: 'Unable to commit transaction.'});
                    } else {
                        myDb.release();
                        resolve(prices);
                    }
                })))
                .catch(err => new Promise((resolve, reject) =>  myDb.rollback(rbErr => {
                    if (rbErr) {
                        log(2, 'rollback failed for errors: ', err, rbErr);
                    }
                    myDb.release();
                    return reject(err);
                })));
        });
    },

    getHistoryByUserId: (userId) => {
        const mealQuery = `
            SELECT
                (CASE WHEN transactions.target = ${mysql.escape(userId)} THEN transactions.amount ELSE -1 * transactions.amount END) AS diff,
                users.name AS user,
                meals.name AS meal
            FROM transactions
            LEFT JOIN users
            ON users.id = (CASE WHEN transactions.target = ${mysql.escape(userId)} THEN transactions.source ELSE transactions.target END)
            LEFT JOIN meals
            ON meals.id = transactions.mealId
            WHERE ${mysql.escape(userId)} in (transactions.target, transactions.source)
            AND NOT transactions.target = transactions.source;`;

        return getConnection()
            .then (myDb => executeQuery(myDb, mealQuery)
                .catch(err => {
                    if (err) {
                        log(4, 'error getting history for user ' + userId);
                    }
                    myDb.release();
                    return Promise.reject(err);
                }));
    }
}