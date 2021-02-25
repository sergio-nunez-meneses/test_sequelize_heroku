# Test Express.js

REST API built using [Express application generator](https://expressjs.com/en/starter/generator.html), and CRUD application using [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html):

```
express folder_name --view=engine
```
```
vue create folder_name
```

### Installed dependencies


Back-end:
```
npm install bcrypt cookie-parser cors debug express express-async-handler express-session fs http-errors joi jsonwebtoken morgan mysql2 nodemon pg pg-hstore sequelize --save
```

Front-end:
```
npm install axios core-js vue vue-router vuex --save
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

### TODO

Back-end:

- Sanitize inputs with express-validator module

Front-end:

- Optimized farmers, farms and users components (html generation, common methods, common css).
