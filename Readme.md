# Foodplanner

Small food planning tool

# Building the project
npm install
npm run-script build

# Starting the Server

provide environment variables:

* FOOD_HOME=/home/food/server/
* FOOD_CLIENT=/home/food/dist/
* FOOD_DB_USERNAME=mydbuser
* FOOD_DB_PASSWORD=mydbpass
* FOOD_DB_NAME=myfooddb
* FOOD_PORT=12345


* ADMIN_DB_USERNAME=mydbadmin
* ADMIN_DB_PASSWORD=mydbadminpassword
* ADMIN_DB_PORT=54321


node server/setup.js
node server/index.js