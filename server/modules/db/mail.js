const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');


module.exports = {
    getMailByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from mailingList where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:getMailByProperty', err);
                    reject({status: 500, message: 'Unable to find mail.'});
                } else {
                    resolve(result[0]);
                }
            }));
        });
    },

    getMailsByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from mailingList where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:getMailByProperty', err);
                    reject({status: 500, message: 'Unable to find mail.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    searchMailsByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from mailingList where ${prop} like ${mysql.escape(val + '%')}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:getMailByProperty', err);
                    reject({status: 500, message: 'Unable to find mail.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    setMailByProperty: (prop, val, options) => {
        const query = `UPDATE mailingList SET
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
                    log(2, 'modules/db/mail:setMailByProperty', err);
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

    setMailPropertyById: (id, option, value) => {
        const query = `UPDATE mailingList SET
            ${mysql.escapeId(option)} = ${mysql.escape(value)}
            WHERE id = ${mysql.escape(id)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:setMailPropertyById', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({});
                }
            }));
        });
    },

    deleteMailByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from mailingList where ${mysql.escapeId(prop)} = ${mysql.escape(val)};`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:deleteMailByProperty', err);
                    reject({status: 500, message: 'Unable to delete mail.'});
                } else {
                    resolve({result: result[0], [prop]: val});
                }
            }));
        });
    },

    createMail: (options) => {
        const query = `INSERT INTO mailingList (
                name,
                mail,
                deadlineReminder,
                creationNotice
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.mail)},
                ${mysql.escape(options.deadlineReminder)},
                ${mysql.escape(options.creationNotice)}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/mail:createSignUp - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'modules/db/mail:createSignUp.2', err, query);
                        reject({status: 500, message: 'Error creating mail'});
                    } else {
                        log(6, 'modules/db/mail:createSignUp - mail created');
                        resolve({
                            name: options.name,
                            mail: options.mail,
                            deadlineReminder: options.deadlineReminder,
                            creationNotice: options.creationNotice,
                            id: result.insertId
                        });
                    }
                });
            });
        })
        .catch(err => {
            if (err && err.status) {
                err.success = false;
                return err;
            }

            return error.db.codeError('modules/db/mail.js:createSignUp.4', arguments);
        });
    },

    getAllMails: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT * FROM mailingList;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/mail:getAllMails', err);
                    reject({status: 500, message: 'Unable to get maillist.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}