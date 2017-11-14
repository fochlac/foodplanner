#!/usr/bin/env node

const   mysql = require('mysql');

let myDb;

function initDb() {
    let db = mysql.createConnection({
          host     : process.env.FOOD_DB_HOST,
          port     : process.env.ADMIN_DB_PORT,
          user     : process.env.ADMIN_DB_USERNAME,
          password : process.env.ADMIN_DB_PASSWORD
        });

    db.on('error', (err) => {
        if (err){
            if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                throw('MySQL-ConnectionError: ' + err);
            } else {
                myDb = initDb();
            }
        }
    });

    db.connect((err) => {
        if (err) {
            throw('MySQL-ConnectionError: ' + err);
        }
    });

    return db;
};

myDb = initDb();

let setup = [
    `CREATE OR REPLACE USER '${process.env.FOOD_DB_USERNAME}'@'${process.env.FOOD_DB_HOST}' IDENTIFIED BY '${process.env.FOOD_DB_PASSWORD}';`,
    `DROP DATABASE IF EXISTS ${process.env.FOOD_DB_NAME};`,
    `CREATE DATABASE IF NOT EXISTS ${process.env.FOOD_DB_NAME};`,
    `GRANT ALL PRIVILEGES ON ${process.env.FOOD_DB_NAME}.* TO '${process.env.FOOD_DB_USERNAME}'@'${process.env.FOOD_DB_HOST}';`,
    `USE ${process.env.FOOD_DB_NAME};`,

    `CREATE TABLE IF NOT EXISTS \`signups\` (
        \`id\`      int             NOT NULL    AUTO_INCREMENT,
        \`name\`    varchar(150)    NOT NULL,
        \`meal\`    int             NOT NULL,
        \`comment\` varchar(150)    NOT NULL,

        PRIMARY KEY (id)
    );`

    `CREATE TABLE IF NOT EXISTS \`meals\` (
        \`id\`              int             NOT NULL    AUTO_INCREMENT,
        \`name\`            varchar(150)    NOT NULL,
        \`description\`     text,
        \`creator\`         varchar(150)    NOT NULL,
        \`time\`            int             NOT NULL,
        \`deadline\`        int             NOT NULL,
        \`signupLimit\`     int,
        \`image\`           varchar(150),

        PRIMARY KEY (id)
    );`
];

function setupDB() {
    myDb.query(setup[0], (err) => {
        if (err) {
            console.log(err);
            console.log(setup[0]);
            process.exit(1);
        } else {
            setup = setup.slice(1);
            if (setup.length) {
                setupDB();
            } else {
                console.log('Completed sucessfully.')
                process.exit();
            }
        }

    });
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log(
`--------------------------------------------------
|           Setup Trainingsplan Server           |
--------------------------------------------------
|                                                |
|      Warnung: Sollten bereits Daten in der     |
|       Datenbank existieren, werden diese       |
|     durch die Installation gelöscht werden     |
|                                                |
--------------------------------------------------
|  Bitte bestätigen Sie den Installationswunsch  |
--------------------------------------------------
(y/n): `.replace(/:\n/, ':'));

process.stdin.on('data', function (text) {
    if (text === 'y\n') {
        setupDB();
    } else if (text === 'n\n') {
        process.exit()
    } else {
        console.log(
`--------------------------------------------------
|  Ungültige Eingabe, bitte bestätigen Sie den   |
|              Installationswunsch               |
--------------------------------------------------
(y/n): `.replace(/:\n/, ':')
        );
    }
});
