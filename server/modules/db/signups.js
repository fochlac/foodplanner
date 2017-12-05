const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');

function flattenResults(result) {
    let objectResult = result.reduce((acc, row) => {
        if (acc[row.id]) {
            acc[row.id].options.push({
                id: row.signupOptionsId,
                value: row.signupOptionsValue,
                count: row.signupOptionsCount,
                show: row.signupOptionsShow
            });
        } else {
            acc[row.id] = {
                id: row.id,
                name: row.name,
                comment: row.comment,
                meal: row.meal,
                paid: row.paid,
                price: row.price,
                userId: row.userId,
                options: (row.signupOptionsId !== null) ? [{
                    id: row.signupOptionsId,
                    value: row.signupOptionsValue,
                    count: row.signupOptionsCount,
                    show: row.signupOptionsShow
                }] : []
            }
        }

        return acc;
    }, {});

    return Object.values(objectResult);
}


module.exports = {
    getSignupByProperty: (prop, val) => {
        const query = `SELECT
                signups.id,
                signups.name,
                signups.paid,
                signups.price,
                signups.userId,
                signups.meal,
                signups.comment,
                signupOptions.mealOptionId AS signupOptionsId,
                signupOptions.value AS signupOptionsValue,
                signupOptions.count AS signupOptionsCount,
                signupOptions.show AS signupOptionsShow
            FROM signups
            LEFT JOIN signupOptions
            ON signups.id = signupOptions.signupId
            WHERE signups.${prop} = ${mysql.escape(val)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:getSignupByProperty', err);
                    reject({status: 500, message: 'Unable to find signup.'});
                } else {
                    resolve(flattenResults(result)[0]);
                }
            }));
        });
    },

    getSignupsByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from signups where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:getSignupByProperty', err);
                    reject({status: 500, message: 'Unable to find signup.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    setSignupPaymentStatusById: (id, state) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`UPDATE signups SET paid = ${mysql.escape(state ? 1 : 0)} where id = ${mysql.escape(id)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:setSignupPaymentStatusById', err);
                    reject({status: 500, message: 'Unable to set signup ' + id + ' to paid.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    setSignupById: (id, options) => {
        const query = `UPDATE signups SET
            \`name\`    = ${mysql.escape(options.name)},
            \`comment\` = ${mysql.escape(options.comment)}
            WHERE \`id\` = ${mysql.escape(id)};`,
            optionsQuery = `INSERT INTO signupOptions (
                    \`signupId\`,
                    \`mealOptionId\`,
                    \`value\`,
                    \`valueId\`,
                    \`count\`,
                    \`show\`
                ) SELECT
                ${options.options.map(option => `
                    ${mysql.escape(id)},
                    ${mysql.escape(option.id)},
                    ${mysql.escape(option.value)},
                    ${option.value ? 'id' : mysql.escape(undefined)},
                    ${mysql.escape(option.count)},
                    ${mysql.escape(option.show)}
                    ${option.value ? `FROM mealOptionValues WHERE name = ${mysql.escape(option.value)} and mealOptionId = ${mysql.escape(option.id)}` : ''}
                `).join(' UNION ALL SELECT')}
                ON DUPLICATE KEY UPDATE
                    \`value\`=VALUES(\`value\`),
                    \`valueId\`=VALUES(\`valueId\`),
                    \`count\`=VALUES(\`count\`),
                    \`show\`=VALUES(\`show\`);`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                if (err) {
                    log(2, 'modules/db/signup:setSignupById', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({
                        name: options.name,
                        comment: options.comment,
                        id: parseInt(id),
                        options: options.options
                    });
                }
            }))
            .then(signup => {
                if (!options.options.length) {
                    myDb.release();
                    return Promise.resolve(signup);
                }
                return new Promise((resolve, reject) => {
                    myDb.query(optionsQuery, (err, result) => {
                        myDb.release();
                        if (err) {
                            log(2, 'modules/db/signup:setSignupById.4', err, optionsQuery);
                            reject({status: 500, message: 'Error updating signup'});
                        } else {
                            resolve(signup);
                            log(6, 'modules/db/signup:setSignupById - option values inserted - signup updated', optionsQuery);
                        }
                    });
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/signup.js:setSignupById.4', arguments);
        });
    },

    deleteSignupById: (id) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from signups where id = ${mysql.escape(id)}`, (err, result) => {
                if (err) {
                    log(2, 'modules/db/signup:deleteSignupByProperty', err);
                    reject({status: 500, message: 'Unable to delete signup.'});
                } else {
                    resolve(result[0]);
                }
            }))
            .then(result => {
                return new Promise((resolve, reject) => {
                    myDb.query(`delete from signupOptions where signupId = ${mysql.escape(id)}`, (err, result) => {
                        myDb.release();
                        if (err) {
                            log(2, 'modules/db/signup:deleteSignupByProperty.1', err, `delete from signupOptions where signupId = ${mysql.escape(id)}`);
                            reject({status: 500, message: 'Error deleting signup options'});
                        } else {
                            resolve(result);
                            log(6, 'modules/db/signup:deleteSignupByProperty - option values deleted');
                        }
                    });
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/signup.js:deleteSignupByProperty.2', arguments);
        });
    },

    createSignUp: (options) => {
        const query = `INSERT INTO signups (
                \`name\`,
                \`meal\`,
                \`userId\`,
                \`comment\`
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.meal)},
                ${mysql.escape(options.userId)},
                ${mysql.escape(options.comment)}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`,
            optionsQuery = (id) => `
                INSERT INTO signupOptions (
                    \`signupId\`,
                    \`mealOptionId\`,
                    \`value\`,
                    \`valueId\`,
                    \`count\`,
                    \`show\`
                ) SELECT
                ${options.options.map(option => `
                    ${mysql.escape(id)},
                    ${mysql.escape(option.id)},
                    ${mysql.escape(option.value)},
                    ${option.value ? 'id' : mysql.escape(undefined)},
                    ${mysql.escape(option.count)},
                    ${mysql.escape(option.show)}
                    ${option.value ? `FROM mealOptionValues WHERE name = ${mysql.escape(option.value)} and mealOptionId = ${mysql.escape(option.id)}` : ''}
                `).join(' UNION ALL SELECT')}
                ON DUPLICATE KEY UPDATE
                    \`value\`=VALUES(\`value\`),
                    \`count\`=VALUES(\`count\`),
                    \`show\`=VALUES(\`show\`);`,
            setPriceQuery = id => `
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
                        WHERE signups.id = ${mysql.escape(id)}
                        AND meals.locked = 1
                        GROUP BY signups.id
                    ) AS sum
                    ON signups.id = sum.id
                set signups.price = (CASE WHEN sum.sum IS NULL THEN 0 ELSE sum.sum END)
                WHERE signups.id = ${mysql.escape(id)};`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/signup:createSignUp - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    if (err) {
                        log(2, 'modules/db/signup:createSignUp.2', err, query);
                        reject({status: 500, message: 'Error creating signup'});
                    } else {
                        log(6, 'modules/db/signup:createSignUp - signup created');
                        resolve({
                            id: result.insertId
                        });
                    }
                });
            }).then(signup => {
                if (!options.options.length) {
                    return Promise.resolve(signup);
                }
                return new Promise((resolve, reject) => {
                    myDb.query(optionsQuery(signup.id), (err, result) => {
                        if (err) {
                            log(2, 'modules/db/signup:createSignUp.4', err, optionsQuery(signup.id));
                            reject({status: 500, message: 'Error creating signup'});
                        } else {
                            resolve(signup);
                        }
                    });
                });
            }).then(signup => {
                return new Promise((resolve, reject) => {
                    myDb.query(setPriceQuery(signup.id), (err, result) => {
                        myDb.release();
                        if (err) {
                            log(2, 'modules/db/signup:createSignUp.4', err, setPriceQuery(signup.id));
                            reject({status: 500, message: 'Error setting price'});
                        } else {
                            resolve(signup);
                            log(6, 'modules/db/signup:createSignUp - price set - signup created');
                        }
                    });
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/signup.js:createSignUp.4', arguments);
        });
    },

    getAllSignups: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT
                signups.id,
                signups.name,
                signups.paid,
                signups.price,
                signups.userId,
                signups.meal,
                signups.comment,
                signupOptions.mealOptionId AS signupOptionsId,
                signupOptions.value AS signupOptionsValue,
                signupOptions.count AS signupOptionsCount,
                signupOptions.show AS signupOptionsShow
            FROM signups
            LEFT JOIN signupOptions
            ON signups.id = signupOptions.signupId;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:getAllSignups', err);
                    reject({status: 500, message: 'Unable to get signuplist.'});
                } else {
                    log(6, 'modules/db/meal:getAllSignups', 'got all data');
                    resolve(flattenResults(result));
                }
            }));
        });
    }
}