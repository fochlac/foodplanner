const   mysql           = require('mysql')
    ,   log             = require(process.env.FOOD_HOME + 'modules/log');

let db = mysql.createPool({
  host     : process.env.ADMIN_DB_HOST,
  port     : process.env.ADMIN_DB_PORT,
  user     : process.env.FOOD_DB_USERNAME,
  password : process.env.FOOD_DB_PASSWORD,
  database : process.env.FOOD_DB_NAME
});

module.exports = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      log(2, 'modules/db/index:1', err);
      reject();
    }
    resolve(connection);
  });
});