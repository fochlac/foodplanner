# Foodplanner

Small food planning tool

component structure:
![ComponentStructure](https://raw.githubusercontent.com/ep-friedel/foodplanner/develop/components.png "Map of the components")

# Full Installation Using Install Script

First clone the repo. Then go to the folder 'buildScripts' and adjust the 'variables' file according to your preferences.

Then run the script 'buildScripts/setup' to install the project and all dependencies.

# Building the project
First go to the project folder, then run the following commands:
```
npm install
npm run-script build
```

# Starting the Server
Before starting the server you need to provide the following environment variables. You can for example do so by writíng them to a file and use the following shell script to export all of them:
```
while read p; do
  export $p
done < .build_scripts/variables
```

* FOOD_HOME=/home/food/server/
* FOOD_CLIENT=/home/food/dist/
* FOOD_DB_USERNAME=mydbuser
* FOOD_DB_PASSWORD=mydbpass
* FOOD_DB_NAME=myfooddb
* FOOD_PORT=12345
* FOOD_EXTERNAL=food-dev.fochlac.com
* DEVELOP=true

Also set up an external mysql database and provide the access data as global variable:

* ADMIN_DB_USERNAME=mydbadmin
* ADMIN_DB_PASSWORD=mydbadminpassword
* ADMIN_DB_PORT=54321
* ADMIN_DB_HOST=localhost

Finally run the setup script to setup the database. Once complete you can start the server.

```
node server/setup.js
node server/index.js
```

# dev-server
https://food-dev.fochlac.com
