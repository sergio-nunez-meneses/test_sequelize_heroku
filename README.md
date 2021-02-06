# Test Express.js

REST API and CRUD application built using [Express application generator](https://expressjs.com/en/starter/generator.html) as follows:

```
express folder_name --view=pug
```

Installed dependencies:

```
npm install bcrypt cookie-parser cors debug express express-async-handler express-session fs http-errors joi jsonwebtoken mongoose morgan mysql2 nodemon pg pg-hstore pug sequelize --save
```

### API

Database and models have been created using [Sequelize CLI](https://www.npmjs.com/package/sequelize-cli).

For database connection, run the following lines inside the root directory:

```
mkdir config
cd config
touch config.json
```

Then, edit the ```config.json``` file with your database information:

```js
{
  "development": {
    "username": "",
    "password": "",
    "database": "database_development",
    "host": "127.0.0.1",
    "port": "", // optional
    "dialect": "mysql"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "database_test",
    "host": "127.0.0.1",
    "port": "", // optional
    "dialect": "mysql"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "database_production",
    "host": "127.0.0.1",
    "port": "", // optional
    "dialect": "mysql"
  }
}
```

Finally, run the following lines:

```
sequelize db:create
sequelize db:migrate
```

### Heroku deployment

Get database URL:

```
heroku config:get DATABASE_URL -a app_name
```

Restart/stop app dyno:

```
heroku ps:restart --app app_name
heroku ps:stop dyno --app app_name
```

Retreive application's most recent logs:

```
heroku logs --app app_name
```
