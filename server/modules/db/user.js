const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');


module.exports = {
    getUserByProperty: (prop, val) => {

        log(6, 'getting user data');
        return getConnection()
        .then (myDb => {
            log(6, 'getting user data : got connection');
            return new Promise((resolve, reject) => myDb.query(`select * from users where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                log(6, 'getting user data : query complete');
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getUserByProperty', err);
                    reject({status: 500, message: 'Unable to find user.'});
                } else {
                    log(6, 'getting user data : query complete - positive result');
                    resolve(result[0]);
                }
            }));
        });
    },

    getUsersByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from users where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getUserByProperty', err);
                    reject({status: 500, message: 'Unable to find user.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    getUnsignedUsersByProperty: (mealId, prop, val) => {
        const query = `
            SELECT users.*
            FROM users
            LEFT OUTER JOIN signups
            ON signups.userId = users.id
            AND signups.meal = ${mealId}
            WHERE signups.userId IS NULL
            AND users.${prop} = ${mysql.escape(val)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getUserByProperty', err);
                    reject({status: 500, message: 'Unable to find user.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    searchUsersByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from users where ${prop} like ${mysql.escape(val + '%')}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getUserByProperty', err);
                    reject({status: 500, message: 'Unable to find user.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    setUserByProperty: (prop, val, options) => {
        const query = `UPDATE users SET
            name                = ${mysql.escape(options.name)},
            mail                = ${mysql.escape(options.mail)},
            deadlineReminder    = ${mysql.escape(options.deadlineReminder)},
            creationNotice      = ${mysql.escape(options.creationNotice)}
            WHERE ${prop} = ${mysql.escape(val)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:setUserByProperty', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({
                        name: options.name,
                        mail: options.mail,
                        deadlineReminder: options.deadlineReminder,
                        creationNotice: options.creationNotice,
                        id: parseInt(val)
                    });
                }
            }));
        });
    },

    setUserPropertyById: (id, option, value) => {
        const query = `UPDATE users SET
            ${mysql.escapeId(option)} = ${mysql.escape(value)}
            WHERE id = ${mysql.escape(id)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:setUserPropertyById', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({});
                }
            }));
        });
    },

    deleteUserByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from users where ${mysql.escapeId(prop)} = ${mysql.escape(val)};`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:deleteUserByProperty', err);
                    reject({status: 500, message: 'Unable to delete user.'});
                } else {
                    resolve({result: result[0], [prop]: val});
                }
            }));
        });
    },

    createUser: (options) => {
        const query = `INSERT INTO users (
                name,
                mail,
                deadlineReminder,
                creationNotice
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.mail)},
                ${mysql.escape(options.deadlineReminder)},
                ${mysql.escape(options.creationNotice)}
            );`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/user:createSignUp - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    myDb.release();
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            log(5, 'modules/db/user:createSignUp.2', 'Error: duplicate user');
                            reject({status: 422, type: 'Bad_Request', reason: 'user_exists'});
                        } else {
                            log(2, 'modules/db/user:createSignUp.2', err, query);
                            reject({status: 500, type: 'Internal_Error', reason: 'Error creating user'});
                        }
                    } else {
                        log(6, 'modules/db/user:createSignUp - user created');
                        resolve({
                            name: options.name,
                            mail: options.mail,
                            deadlineReminder: options.deadlineReminder,
                            creationNotice: options.creationNotice,
                            balance: 0,
                            id: result.insertId
                        });
                    }
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return Promise.reject(err);
            }

            return error.db.codeError('modules/db/user.js:createSignUp.4', arguments);
        });
    },

    getAllUsers: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT * FROM users;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/user:getAllUsers', err);
                    reject({status: 500, message: 'Unable to get userlist.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}