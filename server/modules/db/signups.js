const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error');


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

    setSignupByProperty: (prop, val, options) => {
        const query = `UPDATE signups SET
            name = ${mysql.escape(options.name)},
            comment = ${mysql.escape(options.comment)}
            WHERE  ${prop} = ${mysql.escape(val)};`;

        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:setSignupByProperty', err);
                    reject({status: 500, message: 'Unable to insert data.'});
                } else {
                    resolve({
                        name: options.name,
                        comment: options.comment,
                        id: parseInt(val)
                    });
                }
            }));
        });
    },

    deleteSignupByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from signups where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:deleteSignupByProperty', err);
                    reject({status: 500, message: 'Unable to delete signup.'});
                } else {
                    resolve(result[0]);
                }
            }));
        });
    },

    createSignUp: (options) => {
        const query = `INSERT INTO signups (
                name,
                meal,
                comment
            ) VALUES (
                ${mysql.escape(options.name)},
                ${mysql.escape(options.meal)},
                ${mysql.escape(options.comment)}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/signup:createSignUp - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'modules/db/signup:createSignUp.2', err, query);
                        reject({status: 500, message: 'Error creating signup'});
                    } else {
                        log(6, 'modules/db/signup:createSignUp - signup created');
                        resolve({
                            name: options.name,
                            meal: options.meal,
                            comment: options.comment,
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

            return error.db.codeError('modules/db/signup.js:createSignUp.4', arguments);
        });
    },

    getAllSignups: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT * FROM signups;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/signup:getAllSignups', err);
                    reject({status: 500, message: 'Unable to get signuplist.'});
                } else {
                    resolve(result);
                }
            }));
        });
    }
}