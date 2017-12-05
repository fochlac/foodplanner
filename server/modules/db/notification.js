const   getConnection   = require(process.env.FOOD_HOME + 'modules/db')
    ,   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log')
    ,   error           = require(process.env.FOOD_HOME + 'modules/error')
    ,   crypto          = require('crypto');


module.exports = {

    getNotificationIdsByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`select * from notificationList where ${prop} = ${mysql.escape(val)}`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/notification:getNotificationIdByProperty', err);
                    reject({status: 500, message: 'Unable to find notification.'});
                } else {
                    resolve(result);
                }
            }));
        });
    },

    deleteNotificationIdByProperty: (prop, val) => {
        return getConnection()
        .then (myDb => {
            return new Promise((resolve, reject) => myDb.query(`delete from notificationList where ${mysql.escapeId(prop)} = ${mysql.escape(val)};`, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/notification:deleteNotificationIdByProperty', err);
                    reject({status: 500, message: 'Unable to delete notification.'});
                } else {
                    resolve({result: result[0], [prop]: val});
                }
            }));
        });
    },

    createNotificationId: (options) => {
        const query = `INSERT INTO notificationList (
                type,
                hash,
                subscription
            ) VALUES (
                ${mysql.escape(options.type)},
                ${mysql.escape(crypto.createHash('md5').update(JSON.stringify(options.subscription)).digest("hex"))},
                ${mysql.escape(JSON.stringify(options.subscription))}
            )
            ON DUPLICATE KEY UPDATE \`id\` = \`id\`;`;

        return getConnection()
        .then (myDb => {
            log(6, 'modules/db/notification:createNotification - got db connection');
            return new Promise((resolve, reject) => {
                myDb.query(query, (err, result) => {
                    myDb.release();
                    if (err) {
                        log(2, 'modules/db/notification:createNotification.2', err, query);
                        reject({status: 500, message: 'Error creating notification'});
                    } else {
                        log(6, 'modules/db/notification:createNotification - notification created');
                        resolve({
                            type: options.type,
                            subscription: options.subscription,
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

            return error.db.codeError('modules/db/notification.js:createNotification.4', arguments);
        });
    },

    getAllNotificationIds: () => {
        return getConnection()
        .then (myDb => {
            const query = `SELECT * FROM notificationList;`;

            return new Promise((resolve, reject) => myDb.query(query, (err, result) => {
                myDb.release();
                if (err) {
                    log(2, 'modules/db/notification:getAllNotificationIds', err);
                    reject({status: 500, message: 'Unable to get notificationlist.'});
                } else {
                    log(6, 'modules/db/notification:createNotification - notification created');
                    resolve(result);
                }
            }));
        });
    }
}