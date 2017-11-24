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
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from signups where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:getSignupByProperty', err);
                    reject({status: 500, message: 'Unable to find signup.'});
                } else {
                    resolve(result[0]);
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

    setSignupById: (id, options) => {
        const query = `UPDATE signups SET
            \`name\` = ${mysql.escape(options.name)},
            \`comment\` = ${mysql.escape(options.comment)}
            WHERE  \`id\` = ${mysql.escape(id)};`,
            optionsQuery = `INSERT INTO signupOptions (
                    \`signupId\`,
                    \`mealOptionId\`,
                    \`value\`,
                    \`count\`,
                    \`show\`
                ) VALUES
                ${options.options.map(option => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(option.id)},
                    ${mysql.escape(option.value)},
                    ${mysql.escape(option.count)},
                    ${mysql.escape(option.show)}
                )`).join(',')}
                ON DUPLICATE KEY UPDATE
                    \`value\`=VALUES(\`value\`),
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
                            log(6, 'modules/db/signup:setSignupById - option values inserted - signup updated');
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
                \`comment\`
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.meal)},
                ${mysql.escape(options.comment)}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`,
            optionsQuery = (id) => `
                INSERT INTO signupOptions (
                    \`signupId\`,
                    \`mealOptionId\`,
                    \`value\`,
                    \`count\`,
                    \`show\`
                ) VALUES
                ${options.options.map(option => `(
                    ${mysql.escape(id)},
                    ${mysql.escape(option.id)},
                    ${mysql.escape(option.value)},
                    ${mysql.escape(option.count)},
                    ${mysql.escape(option.show)}
                )`).join(',')}
                ON DUPLICATE KEY UPDATE
                    \`value\`=VALUES(\`value\`),
                    \`count\`=VALUES(\`count\`),
                    \`show\`=VALUES(\`show\`);`;

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
                            name: options.name,
                            meal: options.meal,
                            comment: options.comment,
                            options: options.options,
                            id: result.insertId
                        });
                    }
                });
            }).then(signup => {
                if (!options.options.length) {
                    myDb.release();
                    return Promise.resolve(signup);
                }
                return new Promise((resolve, reject) => {
                    myDb.query(optionsQuery(signup.id), (err, result) => {
                        myDb.release();
                        if (err) {
                            log(2, 'modules/db/signup:createSignUp.4', err, optionsQuery(signup.id));
                            reject({status: 500, message: 'Error creating signup'});
                        } else {
                            resolve(signup);
                            log(6, 'modules/db/signup:createSignUp - option values inserted - signup created');
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
                signups.meal,
                signups.comment,
                signupOptions.mealOptionId AS signupOptionsId,
                signupOptions.value AS signupOptionsValue ,
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
                    resolve(flattenResults(result));
                }
            }));
        });
    }
}