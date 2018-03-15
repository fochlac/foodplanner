#!/usr/bin/env node

const mysql = require('mysql')

let myDb

function initDb() {
  let db = mysql.createConnection({
    host: process.env.FOOD_DB_HOST,
    port: process.env.ADMIN_DB_PORT,
    user: process.env.ADMIN_DB_USERNAME,
    password: process.env.ADMIN_DB_PASSWORD,
  })

  db.on('error', err => {
    if (err) {
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw 'MySQL-ConnectionError: ' + err
      } else {
        myDb = initDb()
      }
    }
  })

  db.connect(err => {
    if (err) {
      throw 'MySQL-ConnectionError: ' + err
    }
  })

  return db
}

myDb = initDb()

let setup = [
  `DROP USER IF EXISTS '${process.env.FOOD_DB_USERNAME}'@'${process.env.ADMIN_DB_HOST}';`,
  `CREATE USER '${process.env.FOOD_DB_USERNAME}'@'${process.env.ADMIN_DB_HOST}' IDENTIFIED BY '${process.env.FOOD_DB_PASSWORD}';`,
  `DROP DATABASE IF EXISTS ${process.env.FOOD_DB_NAME};`,
  `CREATE DATABASE ${process.env.FOOD_DB_NAME};`,
  `GRANT ALL PRIVILEGES ON ${process.env.FOOD_DB_NAME}.* TO '${process.env.FOOD_DB_USERNAME}'@'${process.env.ADMIN_DB_HOST}';`,
  `USE ${process.env.FOOD_DB_NAME};`,

  `CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`name\`                varchar(150)    NOT NULL,
        \`admin\`               int             NOT NULL    DEFAULT 0,
        \`mail\`                varchar(150)    NOT NULL,
        \`balance\`             FLOAT(10, 2)    NOT NULL    DEFAULT 0,
        \`deadlineReminder\`    int                         DEFAULT 0,
        \`creationNotice\`      int                         DEFAULT 0,
        \`instance\`            int             NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`mail\` (\`mail\`)
    );`,

  `CREATE TABLE IF NOT EXISTS \`instances\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`name\`                varchar(150)    NOT NULL,
        \`company\`             varchar(150)    NOT NULL,
        \`subdomain\`           varchar(150)    NOT NULL,
        \`address\`             varchar(150)    NOT NULL,
        \`sprache\`             varchar(150)    DEFAULT "de-DE",
        \`titel\`               varchar(150),
        \`gmail_user\`          varchar(150),
        \`gmail_pass\`          varchar(150),

        PRIMARY KEY (id),
        UNIQUE KEY \`subdomain\` (\`subdomain\`)
    );`,
  `CREATE TABLE IF NOT EXISTS \`notificationList\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`instance\`            int             NOT NULL,
        \`hash\`                varchar(150)    NOT NULL,
        \`subscription\`        TEXT            NOT NULL,
        \`type\`                varchar(150)    NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`hash\` (\`hash\`)
      );`,
  `CREATE TABLE IF NOT EXISTS \`meals\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`instance\`            int             NOT NULL,
        \`name\`                varchar(150)    NOT NULL,
        \`description\`         text,
        \`creator\`             varchar(150)    NOT NULL,
        \`creatorId\`           int             NOT NULL,
        \`price\`               FLOAT(10, 2)    NOT NULL    DEFAULT 0,
        \`time\`                bigint          NOT NULL,
        \`deadline\`            bigint          NOT NULL,
        \`signupLimit\`         int,
        \`locked\`              int                         DEFAULT 0,
        \`datefinder\`          int                         DEFAULT 0,
        \`datefinderLocked\`    int                         DEFAULT 0,
        \`image\`               varchar(150),

        PRIMARY KEY (id)
    );`,
  `CREATE TABLE IF NOT EXISTS \`mealOptions\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`mealId\`              int             NOT NULL,
        \`price\`               FLOAT(10, 2)    NOT NULL    DEFAULT 0,
        \`name\`                varchar(150)    NOT NULL,
        \`type\`                varchar(150)    NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`mealId\` (\`mealId\`, \`name\`)
      );`,
  `CREATE TABLE IF NOT EXISTS \`mealOptionValues\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`mealId\`              int             NOT NULL,
        \`mealOptionId\`        int             NOT NULL,
        \`price\`               FLOAT(10, 2)    NOT NULL    DEFAULT 0,
        \`name\`                varchar(150)    NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`mealOptionId\` (\`mealOptionId\`, \`name\`)
      );`,
  `CREATE TABLE IF NOT EXISTS \`signups\` (
        \`id\`         int             NOT NULL    AUTO_INCREMENT,
        \`instance\`   int             NOT NULL,
        \`name\`       varchar(150)    NOT NULL,
        \`meal\`       int             NOT NULL,
        \`comment\`    varchar(255)    NOT NULL,
        \`userId\`     int,
        \`paid\`       int                         DEFAULT 0,
        \`price\`      FLOAT(10, 2)    NOT NULL    DEFAULT 0,

        PRIMARY KEY (id),
        UNIQUE KEY \`userId\` (\`meal\`, \`userId\`)
    );`,
  `CREATE TABLE IF NOT EXISTS \`signupOptions\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`signupId\`            int             NOT NULL,
        \`mealOptionId\`        int             NOT NULL,
        \`valueId\`             int,
        \`value\`               varchar(150),
        \`count\`               int,
        \`show\`                int,

        PRIMARY KEY (id),
        UNIQUE KEY \`signupId\` (\`signupId\`, \`mealOptionId\`)
      );`,
  `CREATE TABLE IF NOT EXISTS \`transactions\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`source\`              int             NOT NULL,
        \`target\`              int             NOT NULL,
        \`amount\`              FLOAT(10, 2)    NOT NULL,
        \`reason\`              varchar(255)    NOT NULL,
        \`time\`                bigint          NOT NULL,

        PRIMARY KEY (id)
      );`,
  `CREATE TABLE IF NOT EXISTS \`authentication\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`user\`                int             NOT NULL,
        \`hash\`                varchar(150),
        \`salt\`                varchar(150),

        PRIMARY KEY (id),
        UNIQUE KEY \`user\` (\`user\`)
      );`,
  `CREATE TABLE IF NOT EXISTS \`datefinder\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`instance\`            int             NOT NULL,
        \`creator\`             int             NOT NULL,
        \`deadline\`            bigint,

        PRIMARY KEY (id)
      );`,
  `CREATE TABLE IF NOT EXISTS \`datefinder_dates\` (
        \`id\`                  int             NOT NULL    AUTO_INCREMENT,
        \`datefinder\`          int             NOT NULL,
        \`time\`                bigint          NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY \`date\` (\`datefinder\`, \`time\`)
    );`,
  `CREATE TABLE IF NOT EXISTS \`datefinder_signups\` (
        \`user\`                int             NOT NULL,
        \`date\`                int             NOT NULL,

        UNIQUE KEY \`user\` (\`user\`, \`date\`)
    );`,
  `CREATE TABLE IF NOT EXISTS \`datefinder_participants\` (
        \`user\`                int             NOT NULL,
        \`datefinder\`          int             NOT NULL,

        UNIQUE KEY \`user\` (\`user\`, \`datefinder\`)
    );`,
]

function setupDB() {
  myDb.query(setup[0], err => {
    if (err) {
      console.log(err)
      console.log(setup[0])
      process.exit(1)
    } else {
      setup = setup.slice(1)
      if (setup.length) {
        setupDB()
      } else {
        console.log('Completed sucessfully.')
        process.exit()
      }
    }
  })
}
if (process.argv.includes('-y')) {
  setupDB()
} else {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  console.log(
    `--------------------------------------------------
    |           Setup Foodplanner Server             |
    --------------------------------------------------
    |                                                |
    |      Warnung: Sollten bereits Daten in der     |
    |       Datenbank existieren, werden diese       |
    |     durch die Installation gelöscht werden     |
    |                                                |
    --------------------------------------------------
    |  Bitte bestätigen Sie den Installationswunsch  |
    --------------------------------------------------
    (y/n): `.replace(/:\n/, ':'),
  )

  process.stdin.on('data', function(text) {
    if (text === 'y\n') {
      setupDB()
    } else if (text === 'n\n') {
      process.exit()
    } else {
      console.log(
        `--------------------------------------------------
    |  Ungültige Eingabe, bitte bestätigen Sie den   |
    |              Installationswunsch               |
    --------------------------------------------------
    (y/n): `.replace(/:\n/, ':'),
      )
    }
  })
}
